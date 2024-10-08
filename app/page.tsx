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
          Goole<span className="align-super text-sm">*</span> Translate
        </h1>
        <p className="w-full text-center text-gray-500 text-sm mb-4">
          <span className="align-super">*</span>Goole is a port town in
          Yorkshire, and is nowt to do wi&apos; Google company
        </p>
        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-3 md:grid-rows-1">
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <textarea
                className="h-32 w-full p-2 border border-gray-300 rounded shadow-xl active:outline-[#4285F4] focus:outline-[#4285F4] "
                value={input}
                placeholder={
                  isLoading ? "Translating..." : currentPlaceholderText
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
          <div>
            <svg
              className="w-6 h-8 mx-auto rotate-90 md:rotate-0"
              fill="#000000"
              version="1.1"
              id="Layer_1"
              width="800px"
              height="800px"
              viewBox="0 0 92 92"
              enable-background="new 0 0 92 92"
            >
              <path
                id="XMLID_1523_"
                d="M92,55.5c0,1.1-0.4,2.1-1.2,2.8L72.2,76.9c-0.8,0.8-1.8,1.1-2.8,1.1c-1,0-2.1-0.5-2.8-1.2
	c-1.6-1.6-1.6-4.2,0-5.8l11.7-12H39.2c-2.2,0-4-1.8-4-4s1.8-4,4-4h39.1L66.6,39.5c-1.6-1.6-1.6-3.9,0-5.4c1.6-1.6,4.1-1.6,5.7,0
	l18.6,18.6C91.6,53.4,92,54.4,92,55.5z M13.7,41h39.1c2.2,0,4-1.8,4-4s-1.8-4-4-4H13.7l11.7-12c1.6-1.6,1.6-4.2,0-5.8
	s-4.1-1.6-5.7-0.1L1.2,33.7C0.4,34.4,0,35.4,0,36.5s0.4,2.1,1.2,2.8l18.6,18.6c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2.1-0.4,2.8-1.2
	c1.6-1.6,1.6-3.9,0-5.4L13.7,41z"
              />
            </svg>
          </div>
          <div className="space-y-4 mb-16">
            {messages.length > 0 && (
              <div className="whitespace-pre-wrap">
                <div>
                  <p>
                    {isLoading ? (
                      ""
                    ) : messages[messages.length - 1].content.length > 0 ? (
                      <>
                        <h3 className="italic">Original:</h3>
                        <p className="italic">
                          {messages[messages.length - 2].content}
                        </p>
                        <h3 className="">Translation:</h3>
                        <p>{messages[messages.length - 1].content}</p>
                      </>
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
