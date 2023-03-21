import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Router from 'next/router'

const ShareTargetPage = () => {

  const [link, setLink] = useState();
  const [parsedUrl, setParsedUrl] = useState();

  useEffect(() => {

    var parsedUrl = window.location.toString();
    let link = ''
    let results = parsedUrl.split('/description,%20');
    link = results[1]

    setLink(link)
    setParsedUrl(parsedUrl)

    Router.push({
      pathname: '/',
      query: { myLink: results[1] }
    })

  }, [link, parsedUrl]);


  return (
    <div className="flex min-h-screen items-center circular">
      <CircularProgress sx={{ color: "rgb(132 204 22)" }} />
    </div>
  );
};

export default ShareTargetPage;
