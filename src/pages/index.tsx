import { useState, useEffect } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
require("isomorphic-fetch");

export default function Home() {
  const router = useRouter();

  const [pastedText, setPastedText] = useState("");
  const [url, setUrl] = useState("");
  const [link, setLink] = useState("");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  if (router?.components) {
    //@ts-ignore
    let myLink = String(router.components["/"].query?.myLink);
    myLink = myLink == "undefined" ? "" :myLink.slice(0, 6) + "/" + myLink.slice(6);
    if (myLink != "" && myLink !== "undefined" && myLink !== link) {
      // check for includes("link.medium.com")
      // if so => fetch link and get  1st “validateProtocol” set value tu URL
      // then
      setLink(myLink);
      handleSubmit(undefined, myLink);
      // myLink = "";
    }
  }

  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.code === "Enter") {
        handleSubmit();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });
  const handleShortLink = () => {

  }

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setPastedText(text);
    setUrl(text);
  };

  const handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
    setPastedText(event.currentTarget.value);
  }

  const handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>,
    fetchLink?: string
  ) => {
    setIsLoading(true);
    if (event) event.preventDefault();
    let target = String(url != "" ? url : fetchLink != "" ? fetchLink : "");
    if (target != "" && target != "undefined") {
      // build scribe url
      let urlQueue = new URL(target).pathname;
      let buildedUrl = `https://scribe.rip${urlQueue}`;

      // fetch scribed Resopnse
      const response = await fetch(`/api/proxy/${buildedUrl}`);
      const html = await response.text();

      setHtml(html);
    }
    setIsLoading(false);
  }

  return (
    <>
      {!html && !isLoading && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center h-screen w-screen mainForm"
        >
          <span className="text-gray-700 pb-2 text-xl mb-5">
            📃 Paste Medium article&rsquo;s URL:
          </span>
          <input
            aria-label="Paste Medium article's URL:"
            type="text"
            name="url"
            value={url || pastedText}
            onChange={handleUrlChange}
            className="w-80 px-4 py-2 mb-3 border border-gray-300 rounded-sm shadow focus:ring-2 focus:ring-gray-300  focus:outline-none"
          />
          <div className="flex w-80 justify-between  ">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaste();
              }}
              className="mt-4 px-4 py-2 text-blue-400 border border-blue-400 rounded-sm shadow hover:bg-blue-400 hover:text-white"
            >
              Paste url
            </button>
            <button
              className="mt-4 px-4 py-2 border border-red-300 hover:bg-red-400 text-red-300 hover:text-white rounded-sm shadow"
              onClick={(e) => {
                e.preventDefault();
                setPastedText("");
                setUrl("");
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              className="mt-4 px-4 py-2 text-lime-500 border border-lime-500 rounded-sm shadow hover:bg-lime-500 hover:text-white"
            >
              Scribe It !
            </button>
          </div>
        </form>
      )}
      {isLoading && (
        <div className="flex min-h-screen items-center circular">
          <CircularProgress sx={{ color: "rgb(132 204 22)" }} />
        </div>
      )}
      {html && !isLoading && (
        <div className="container p-10">
          <p className="text-md">
            Original url :
            <span className="text-blue-400">
              <a href={url || link} target="_blank">
                {url || link}
              </a>
            </span>
          </p>
          <hr className="mt-4" />
          <div
            className="space-y-4"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      )}
      {html && (
        <button
          className="bg-zinc-300 hover:bg-zinc-500 text-black py-2 px-3 rounded fixed bottom-10 right-10 shadow-lg"
          onClick={() => {
            setHtml("");
            setUrl("");
          }}
        >
          <ReplyIcon sx={{ color: "#383E42" }} />
        </button>
      )}
    </>
  );
}
