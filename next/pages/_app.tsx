import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <Component {...pageProps} />
    </>
  );
}
