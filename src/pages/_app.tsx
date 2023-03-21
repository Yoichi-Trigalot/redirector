import { AppProps } from "next/app";
import "../styles/globals.scss";
import { ThemeProvider } from "next-themes";
import { Layout } from "../components/layout";
import "@fontsource/roboto";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider attribute="class" enableSystem={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
