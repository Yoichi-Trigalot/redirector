import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Router from 'next/router'

const ShareTargetPage = () => {

  const [link, setLink] = useState();
  const [parsedUrl, setParsedUrl] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    var parsedUrl = window.location.toString();
    let link = ''
    let results = parsedUrl.split('/description,%20');
    link = results[1]

    setLink(link)
    setParsedUrl(parsedUrl)

    setIsLoading(false);


  }, [link, parsedUrl, isLoading]);

  // Router.push({
  //   pathname: '/',
  //   query: { link: {link} }
  // })

  return (
    <div>
      {
        isLoading &&
        <CircularProgress />
      }
      {
        !isLoading &&
        <>
          <h1>Share Target Page</h1>
          <p className="w-80"> Link: {link}</p>
          <p className="w-80"> Parsed Url: {parsedUrl}</p>
        </>
      }
    </div>
  );
};

export default ShareTargetPage;
