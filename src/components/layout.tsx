import React, { ReactNode } from "react";
import Head from "next/head";

interface MyProps {
  children: ReactNode;
}

export const Layout = ({ children }: MyProps) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Redirector</title>
        <meta name="description" content="" />
        <link rel="icon" href="/icon-192x192.png" />
      </Head>
      <div className="min-h-screen flex flex-col justify-between ">
        <div className="flex flex-col justify-start min-h-full items-center">
          {children}
        </div>
      </div>
    </>
  );
};
