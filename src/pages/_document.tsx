import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fefefe" />
      </Head>
      <body className="bg-stone-100 dark:bg-zinc-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
