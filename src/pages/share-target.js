import react, { useEffect, useState } from "react";

const ShareTargetPage = () => {

  const [sharedLink, setSharedLink] = useState();

  useEffect(() => {
    var parsedUrl = new URL(window.location.toString());
    setSharedLink({
      name: parsedUrl.searchParams.get('name'),
      description: parsedUrl.searchParams.get('description'),
      link: parsedUrl.searchParams.get('link'),
    })
    alert(sharedLink);
  }, [sharedLink]);

  return (
    <div>
      <h1>Share Target Page</h1>
      <p>{sharedLink?.title}</p>
    </div>
  );
};

export default ShareTargetPage;
