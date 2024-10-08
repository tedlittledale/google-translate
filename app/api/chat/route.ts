import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI || "";
import { convertToCoreMessages, streamText, tool } from "ai";
import { findRelevantContent } from "@/lib/ai/embedding";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

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

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful translation engine that can translate text into Yorkshire vernacular.
    Whatever the user asks, you should translate it into Yorkshire vernacular using as much slang as possible.
    The translation should be much shorter and to the point than the original text. Yorkshire folk are know for their straight talking so the translation should reflect this.
      You should base the translation on the following guides to speaking yorkshire vernacular ${similarGuides
        .map(({ content }: { content: string }) => content)
        .join(", ")}.
      
      `,
    messages: convertToCoreMessages(messages),
    tools: {
      //   addResource: tool({
      //     description: `add a resource to your knowledge base.
      //       If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
      //     parameters: z.object({
      //       content: z
      //         .string()
      //         .describe("the content or resource to add to the knowledge base"),
      //     }),
      //     execute: async ({ content }) => createResource({ content }),
      //   }),
      // getInformation: tool({
      //   description: `get information from your knowledge base to answer questions. returns a string`,
      //   parameters: z.object({
      //     question: z.string().describe("the users question"),
      //   }),
      //   execute: async ({ question }) => {
      //     const relevantContent = await findRelevantContent(question);
      //     console.log({ relevantContent });
      //     return relevantContent;
      //   },
      // }),
    },
  });

  return result.toDataStreamResponse();
}
