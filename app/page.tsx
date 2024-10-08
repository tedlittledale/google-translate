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
  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  const placeholderTexts = [
    "Translate some text into Yorkshire...",
    "Go on pet, don't be shy...",
    "I’ll tek yer long chat an’ make it short an’ sweet!...",
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
    <div className="min-h-lvh px-5">
      <div className="flex relative flex-col w-full  mx-auto stretch bg-white p-2 pb-24 sm:p-4 items-start min-h-lvh">
        <h1 className="text-3xl font-bold text-center w-full text-[#4285F4] mb-4">
          Goole* Translate
        </h1>
        <p className="text-center text-gray-500 text-sm mb-4">
          *Goole is a port town in Yorkshire, and is nowt to do wi&apos; Google
          company
        </p>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3 md:grid-rows-1">
          <div>
            <form
              onSubmit={() => {
                handleSubmit();
              }}
            >
              <textarea
                className="w-full p-2 border border-gray-300 rounded shadow-xl active:outline-[#4285F4] focus:outline-[#4285F4] "
                value={input}
                placeholder={
                  isLoading ? "Generating..." : currentPlaceholderText
                }
                onChange={handleInputChange}
                disabled={!!isLoading}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4285F4] text-white rounded-md"
                  disabled={!!isLoading}
                >
                  Translate
                </button>
              </div>
            </form>
          </div>
          <div className="space-y-4 mb-16">
            {messages.length > 0 && (
              <div className="whitespace-pre-wrap">
                <div>
                  <p>
                    {isLoading ? (
                      "Translating..."
                    ) : messages[messages.length - 1].content.length > 0 ? (
                      messages[messages.length - 1].content
                    ) : (
                      <span className="italic font-light"></span>
                    )}{" "}
                  </p>

                  {isLoading &&
                    messages[messages.length - 1].id ===
                      messages[messages.length - 1].id && (
                      <div className="text-sm text-gray-500">
                        <div className="flex space-x-2 justify-center items-center bg-white mt-4 dark:invert">
                          <span className="sr-only">Loading...</span>
                          <div className="h-2 w-2 bg-[#4285F4] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-[#4285F4] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-[#4285F4] rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
