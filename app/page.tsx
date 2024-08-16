"use client";

import { useChat } from "ai/react";

const ProcessToolInvocations = ({
  toolInvocations,
}: {
  toolInvocations: any[];
}) => {
  if (toolInvocations.length === 0) {
    return null;
  }
  return (
    <div className="space-y-2">
      {toolInvocations.map((t: any) => (
        <div key={t.id}>
          <div className="font-bold">
            Answer based on summaries of pages from the house337.com website
          </div>
          <p>{t?.result?.content}</p>
          <h4 className="font-bold text-sm">Pages referenced</h4>
          <ul>
            {t?.result?.websitesReferenced.map((w: string) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  console.log({ messages });
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    <ProcessToolInvocations
                      toolInvocations={m.toolInvocations || []}
                    />
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask me something about House 337..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
