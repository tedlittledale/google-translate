import { createResource } from "@/lib/actions/resources";
import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { findRelevantContent } from "@/lib/ai/embedding";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Assume the user is asking questions about the information you have, which is summaries of a house 337 website house337.com pages stored in a database as embeddings
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
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
      getInformation: tool({
        description: `get information from your knowledge base to answer questions. returns a string`,
        parameters: z.object({
          question: z.string().describe("the users question"),
        }),
        execute: async ({ question }) => {
          const relevantContent = await findRelevantContent(question);
          console.log({ relevantContent });
          return relevantContent;
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
