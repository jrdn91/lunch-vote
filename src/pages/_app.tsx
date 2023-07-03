import { emotionCache } from "@/emotion-cache";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

import { RouterTransition } from "@/components/RouterTransition";
import { NavigationProgress } from "@mantine/nprogress";
import { Rubik } from "next/font/google";
import PushNotifications from "@/components/PushNotifications";

const rubik = Rubik({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

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
              <NavigationProgress />
              <RouterTransition />
              <Component {...pageProps} />
              <Notifications />
              <PushNotifications />
            </MantineProvider>
          </ClerkProvider>
        </Hydrate>
        {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </main>
  );
}
