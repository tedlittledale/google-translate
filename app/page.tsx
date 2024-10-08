"use client";
import { useEffect, useState } from "react";
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
            {t?.result?.content ? "Translation" : "Generating translation"}
          </div>
          <p>{t?.result?.content}</p>
          {/* <h4 className="font-bold text-sm">
            {t?.result?.websitesReferenced ? "Pages referenced" : ""}
          </h4> */}
          {/* {
            <ul>
              {t?.result?.websitesReferenced.map((w: string) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          } */}
        </div>
      ))}
    </div>
  );
};

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  const placeholderTexts = [
    "Ask me something about Ted...",
    "Who has Ted worked for?...",
    "What has Ted worked on?...",
    "Why should I hire Ted?...",
    "Tell me about Ted's dog?...",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [currentPlaceholderText, setCurrentPlaceholderText] = useState("  ");
  useEffect(() => {
    const updatePlaceholder = () => {
      setCurrentPlaceholder((current) =>
        current === placeholderTexts.length - 1 ? 0 : current + 1
      );
    };
    const interval = setInterval(updatePlaceholder, 3000);
    return () => clearInterval(interval);
  }, [setCurrentPlaceholder]);
  useEffect(() => {
    let currentLength = 0;

    const interval = setInterval(() => {
      if (currentLength < placeholderTexts[currentPlaceholder].length + 1) {
        const currentText = placeholderTexts[currentPlaceholder];

        const currentTextSlice = currentText.slice(0, currentLength + 1);

        setCurrentPlaceholderText(currentTextSlice);
        currentLength++;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [currentPlaceholder, setCurrentPlaceholderText]);

  return (
    <div className="min-h-lvh ">
      <div className="flex relative flex-col w-full max-w-md  mx-auto stretch bg-white p-2 pb-24 sm:p-4 items-start min-h-lvh">
        <div className="space-y-4 mb-16">
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

                {isLoading && m.id === messages[messages.length - 1].id && (
                  <div className="text-sm text-gray-500">
                    <div className="flex space-x-2 justify-center items-center bg-white mt-4 dark:invert">
                      <span className="sr-only">Loading...</span>
                      <div className="h-2 w-2 bg-[#EF476F] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-[#EF476F] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-[#EF476F] rounded-full animate-bounce"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="fixed bottom-5 w-full max-w-[27rem]  p-2 ml-[-0.5rem] border border-gray-300 rounded shadow-xl active:outline-[#EF476F] focus:outline-[#EF476F] "
            value={input}
            placeholder={isLoading ? "Generating..." : currentPlaceholderText}
            onChange={handleInputChange}
            disabled={!!isLoading}
          />
        </form>
      </div>
    </div>
  );
}
