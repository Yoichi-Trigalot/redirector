import { KeyboardEvent, useState, useEffect } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
require("isomorphic-fetch");

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(function (reg) {
          console.log("Service worker registered.");
        })
        .catch(function (err) {
          console.log("Service worker not registered. This happened:", err);
        });
    }

    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.code === "Enter") {
        console.log(`You pressed ${e.code}`);
        handleSubmit();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");

  function handleUrlChange(event: React.FormEvent<HTMLInputElement>) {
    setUrl(event.currentTarget.value);
  }

  async function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();
    if (url != "") {
      // build scribe url
      let urlQueue = new URL(url).pathname;
      let buildedUrl = `https://scribe.rip${urlQueue}`;

      // fetch scribed Resopnse
      const response = await fetch(`/api/proxy/${buildedUrl}`);
      const html = await response.text();

      setHtml(html);
    }
  }

  return (
    <>
      {!html && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center h-screen w-screen mainForm"
        >
          <span className="text-gray-700 pb-2">
            📃 Paste Medium article&rsquo;s URL:
          </span>
          <label className="my-4">
            <input
              type="text"
              name="url"
              value={url}
              onChange={handleUrlChange}
              className="w-80 ml-2 px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-400 focus:border-transparent"
            />
          </label>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-zinc-300 text-black rounded-md shadow-sm hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-opacity-50"
          >
            Scribe It !
          </button>
        </form>
      )}
      {html && (
        <>
          <p> Original url : {url}</p>
          <div
            className="container p-10 space-y-4"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </>
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
