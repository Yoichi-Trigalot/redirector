import { useState, useEffect } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
// google Analytics
import ReactGA from "react-ga";

require("isomorphic-fetch");

export default function Home() {
  const router = useRouter();
  //theme part
  const { systemTheme, theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  // feature part
  const [pastedText, setPastedText] = useState("");
  const [url, setUrl] = useState("");
  const [link, setLink] = useState("");
  const [html, setHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (typeof window !== "undefined") {
    if (window.location.href.includes("fromPwa=true")) {
      window.addEventListener("appinstalled", () => {
        ReactGA.event({
          category: "PWA",
          action: "Install",
          label: "User installed PWA",
        });
      });
    }
  }

  useEffect(() => {
    ReactGA.initialize("G-FQCPHZF3MJ");

    setIsMounted(true);

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

  const handleShortLink = async (shortLink: string): Promise<string> => {
    let result = "";
    try {
      const response = await fetch(`/api/proxy/${shortLink}`);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const element = doc.querySelector('a[class="action"]');
      if (element) {
        //@ts-ignore
        result = element.href;
      }
    } catch (error) {
      console.error(error);
    }

    return result;
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setPastedText(text);
    setUrl(text);
  };

  const handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    setUrl(event.currentTarget.value);
    setPastedText(event.currentTarget.value);
  };

  const handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>,
    fetchLink?: string
  ) => {
    setIsLoading(true);
    if (event) event.preventDefault();
    let target = String(url != "" ? url : fetchLink != "" ? fetchLink : "");
    if (target != "" && target != "undefined") {
      if (target.includes("link.medium.com"))
        target = await handleShortLink(target);
      // build scribe url
      console.log("target", target);
      let urlQueue = new URL(target).pathname;
      let buildedUrl = `https://scribe.rip${urlQueue}`;

      // fetch scribed Resopnse
      const response = await fetch(`/api/proxy/${buildedUrl}`);
      const html = await response.text();

      setHtml(html);
    }
    setIsLoading(false);
  };

  //@ts-ignore
  if (router?.components) {
    //@ts-ignore
    let myLink = String(router.components["/"].query?.myLink);
    myLink =
      myLink == "undefined" ? "" : myLink.slice(0, 6) + "/" + myLink.slice(6);
    if (myLink != "" && myLink !== "undefined" && myLink !== link) {
      if (myLink.includes("link.medium.com")) {
        handleShortLink(myLink).then((result) => (myLink = result));
      }
      setLink(myLink);
      handleSubmit(undefined, myLink);
    }
  }

  const renderThemeChanger = () => {
    if (!isMounted) return;

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (
        <svg
          className="h-5 w-5 text-zinc-800 fill-current cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={() => setTheme("light")}
        >
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      );
    } else {
      return (
        <svg
          className="h-5 w-5 text-stone-100 fill-current cursor-pointer"
          viewBox="0 0 20 20"
          fill="currentColor"
          onClick={() => setTheme("dark")}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      );
    }
  };

  return (
    <>
      {!html && !isLoading && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center h-screen w-screen mainForm"
        >
          <span className="text-zinc-800  dark:text-stone-100 pb-2 text-xl mb-5">
            📃 Paste Medium article&rsquo;s URL:
          </span>
          <input
            aria-label="Paste Medium article's URL:"
            type="text"
            name="url"
            value={url || pastedText}
            onChange={handleUrlChange}
            className="bg-stone-100 dark:bg-zinc-800 w-80 px-4 py-2 mb-3 border border-gray-300 dark:border-gray-500 rounded-sm shadow focus:ring-2 focus:ring-gray-300  focus:outline-none"
          />
          <div className="flex w-80 justify-between  ">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaste();
              }}
              className="mt-4 px-4 py-2 text-blue-400 border border-blue-400 rounded-sm shadow hover:bg-blue-400 hover:text-stone-100"
            >
              Paste url
            </button>
            <button
              className="mt-4 px-4 py-2 border border-red-300 hover:bg-red-400 text-red-300 hover:text-stone-100 rounded-sm shadow"
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
              className="mt-4 px-4 py-2 text-lime-500 border border-lime-500 rounded-sm shadow hover:bg-lime-500 hover:text-stone-100"
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
            <span className="text-blue-400 pl-2">
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
      <button
        className="dark:bg-stone-100 bg-zinc-800 py-2 px-3 rounded fixed top-10 right-10 shadow-lg"
        name="night mode toggle button"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {renderThemeChanger()}
      </button>
      {html && (
        <button
          className="bg-zinc-800 dark:bg-stone-100 dark:text-zinc-800  text-stone-100 py-2 px-3 rounded fixed bottom-10 right-10 shadow-lg"
          onClick={() => {
            setHtml("");
            setUrl("");
          }}
        >
          <ReplyIcon
            sx={{
              color:
                (theme === "system" ? systemTheme : theme) === "dark"
                  ? "#27272a"
                  : "#f5f5f4",
            }}
          />
        </button>
      )}
    </>
  );
}
