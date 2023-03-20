import { useState, useEffect } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
require("isomorphic-fetch");


export default function Home() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  if (router?.components) {
    //@ts-ignore
    let myLink = String(router.components["/"].query?.myLink);
    myLink = myLink.slice(0, 6) + "/" + myLink.slice(6); // todo utile une fois qu'on fetch le bon lien ? //
    if (myLink != "") {
      // TODO: Pb de boucle ici dans le handle submit ...
      // handleSubmit(undefined, String(myLink));
      // myLink = "";
    }
  }

  useEffect(() => {
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


  function handleUrlChange(event: React.FormEvent<HTMLInputElement>) {
    setUrl(event.currentTarget.value);
  }

  async function handleSubmit(
    event?: React.FormEvent<HTMLFormElement>,
    link?: string
  ) {
    setIsLoading(true);
    if (event) event.preventDefault();
    let target = String(url != "" ? url : link != "" ? link : "");
    if (target != "") {
      // build scribe url
      let urlQueue = new URL(target).pathname;
      let buildedUrl = `https://scribe.rip${urlQueue}`;

      // fetch scribed Resopnse
      const response = await fetch(`/api/proxy/${buildedUrl}`);
      const html = await response.text();

      setHtml(html);
      setIsLoading(false);
    }
  }

  return (
    <>
      {!html && !isLoading && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center h-screen w-screen mainForm"
        >
          {/* <p className="w-80">link: {myLink}</p> */}
          <span className="text-gray-700 pb-2">
            📃 Paste Medium article&rsquo;s URL:
          </span>
          <input
            aria-label="Paste Medium article's URL:"
            type="text"
            name="url"
            value={url}
            onChange={handleUrlChange}
            className="w-80 ml-2 px-4 py-2 border border-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-zinc-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-zinc-300 text-black rounded-md shadow-sm hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-opacity-50"
          >
            Scribe It !
          </button>
        </form>
      )}
      {isLoading && (
        <div className="flex min-h-screen items-center circular">
          <CircularProgress />
        </div>
      )}
      {html && !isLoading && (
        <div className="container p-10">
          <p className="text-md">
            Original url :{" "}
            <span className="text-blue-400">
              <a href={url} target="_blank">
                {url}
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
