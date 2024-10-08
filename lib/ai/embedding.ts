import { embed, embedMany, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { db } from "../db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI || "";
const embeddingModel = openai.embedding("text-embedding-3-small");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

async function vectorSearch(embedding: any, collection: any) {
  // Define the vector search pipeline
  const pipeline = [
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 150,
        limit: 4,
      },
    },
    {
      $project: {
        url: 1, // Include the plot field
        content: 1, //  # Include the title field
        score: {
          $meta: "vectorSearchScore", //# Include the search score
        },
      },
    },
  ];

  // Execute the search
  const results = await collection.aggregate(pipeline).toArray();
  return results;
}

export const findRelevantContent = async (userQuery: string) => {
  const client = new MongoClient(uri);
  let similarGuides = [] as any[];
  try {
    await client.connect();
    const database = client.db("Yorkshire"); // Replace with your database name
    const collection = database.collection("Yorkshire"); // Replace with your collection name
    console.log("Connected to the collection", collection.collectionName);
    //fetch all the rows from the collection
    const options = {
      projection: {
        url: 1, // Include the plot field
        content: 1,
      },
    };
    similarGuides = await collection.find({}, options).toArray();
    // console.log({ similarGuides });
  } finally {
    await client.close();
  }

  // get open ai to generate a response to the userQuery based on the similarGuides summaries

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Translate the following text into yorkshire vernacular, using as much slang as possible  : ${userQuery}, 
      The translation should be shorter and to the point than the original text. Yorkshire folk are know for their straight talking so the translation should reflect this.
      You should base the translation on the following guides to speaking yorkshire vernacular ${similarGuides
        .map(({ content }: { content: string }) => content)
        .join(", ")}.
      
      `,
  });
  console.log({ text });
  return {
    content: text,
    websitesReferenced: similarGuides.map(({ url }: { url: string }) => url),
  };
};
