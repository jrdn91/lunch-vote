import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { emotionCache } from "@/emotion-cache";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Notifications } from "@mantine/notifications";

import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <main className={rubik.className}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ClerkProvider {...pageProps}>
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              emotionCache={emotionCache}
              theme={{
                fontFamily: "Rubik, sans-serif",
              }}
            >
              <Component {...pageProps} />
              <Notifications />
            </MantineProvider>
          </ClerkProvider>
        </Hydrate>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </main>
  );
}
