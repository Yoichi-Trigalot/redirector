import react, { useEffect, useState } from "react";

const ShareTargetPage = () => {

	const [sharedLink, setSharedLink] = useState();

  useEffect(() => {
    // Listen for the "share" event and handle the shared data
    navigator.share.addEventListener("share", (event) => {
      // Get the shared data from the event
      const { title, text, url } = event.data;

      // Do something with the shared data (e.g. display it on the page)
      setSharedLink({ title: title, text: text, link: url });
    });

    // Clean up the event listener
    return () => {
      window.removeEventListener("share");
    };
  }, []);

  return (
    <div>
      <h1>Share Target Page</h1>
      <p>{sharedLink?.title}</p>
    </div>
  );
};

export default ShareTargetPage;
