import CustomWebView from "@/components/CustomWebView";
import { useWebViewWithId, webViewOrigin } from "@/components/useWebView";
import { isLightColor } from "@/lib/ColorUtil";
import {
  parseMessage,
  handleMessage,
  useMessageManager,
} from "@/lib/MessageManager";
import { Navigator, router, SplashScreen } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import {
  MessageEventType,
  NavigationEvent,
  PageEvent,
} from "message-type/message-type";
import { Platform } from "react-native";
import WebView from "react-native-webview";
import { MutableRefObject, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CookieManager from "@react-native-cookies/cookies";
import AuthManager, { CookieName } from "@/lib/AuthManager";
import React from "react";

export default function Index() {
  const { setIsLoading, isLoading, webViewRefs, setUrl } = useWebViewWithId("index");
  const [cookie, setCookie] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  return (
    <WebView
      ref={(node) => {
        // WebView ref 설정을 위한 컴포넌트에서의 사용 예시
        if (webViewRefs.current) {
          webViewRefs.current["index"] = node;
        }
      }}
      source={{
        uri: webViewOrigin,
        headers: {
          "Top-Inset": `${insets.top}`,
        },
        // uri: 'http://localhost:3000/test'
        // uri: 'https://inunity-server.squidjiny.com/v1/auth/test'
      }}
      onNavigationStateChange={({ url, navigationType }) => {
        console.log("Navigation changed:", url, navigationType);

        setUrl(url);
      }}
      thirdPartyCookiesEnabled
      domStorageEnabled
      incognito={false}
      webviewDebuggingEnabled
      javaScriptEnabled
      sharedCookiesEnabled
      userAgent={`Mozilla/5.0 (${Platform.OS}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36 INUnity_WebView`}
      onLoadStart={() => setIsLoading(true)}
      onLoadEnd={() => setIsLoading(false)}
      onMessage={(event) => {
        const message = parseMessage(event.nativeEvent.data);
        handleMessage(message, {
          [MessageEventType.Login]: () => {
            router.push("/list");
          },
          [MessageEventType.Navigation]: () => {
            const navigation = message.value as NavigationEvent;
            if (navigation === -1) router.back();
            else
              router.push({
                pathname: navigation.path as any,
                params: navigation.params as any,
              });
          },
          [MessageEventType.Log]: () => {
            console.log(message.value);
          },
        });
      }}
    ></WebView>
  );
}
