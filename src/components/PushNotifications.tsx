import React, { useEffect, useRef } from "react";
import "firebase/messaging";
import { firebaseCloudMessaging } from "../utils/firebase";
// import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import { getApp } from "firebase/app";
import { MessagePayload, getMessaging, onMessage } from "firebase/messaging";
import { notifications } from "@mantine/notifications";
import { Avatar } from "@mantine/core";
import { Info } from "react-feather";

function PushNotifications() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const registered = useRef<boolean>(false);
  useEffect(() => {
    if (!isSignedIn) return;
    if (registered.current) return;
    setToken();

    // Event listener that listens for the push notification event in the background
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        showNotification(event.data.firebaseMessaging.payload);
      });
    }

    // Calls the getMessage() function if the token is there
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
    registered.current = true;
  }, [isSignedIn]);

  // Handles the click function on the toast showing push notification
  const handleClickPushNotification = (url: string) => {
    // router.push(url);
  };

  // Get the push notification message and triggers a toast to display it
  function getMessage() {
    const firebaseApp = getApp();
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (message) => {
      showNotification(message);
    });
    // messaging.onMessage((message) => {
    //   toast(
    //     <div onClick={() => handleClickPushNotification(message?.data?.url)}>
    //       <h5>{message?.notification?.title}</h5>
    //       <h6>{message?.notification?.body}</h6>
    //     </div>,
    //     {
    //       closeOnClick: false,
    //     }
    //   );
    // });
  }

  function showNotification(payload: MessagePayload) {
    notifications.show({
      message: payload.notification?.body,
      title: payload.notification?.title,
      icon: (
        <Avatar color="cyan">
          <Info />
        </Avatar>
      ),
      onClick: () => {
        if (payload.data?.url) {
          router.push(payload.data.url);
        }
      },
    });
  }

  return null;
}

export default PushNotifications;
