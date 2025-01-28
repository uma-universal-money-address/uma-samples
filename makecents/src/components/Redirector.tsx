"use client";

import { useNwcRequester, useOAuth } from "@uma-sdk/uma-auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Redirector({ redirectTo = "/" }) {
  const { nwcRequester } = useNwcRequester();
  const { authConfig } = useOAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof document !== "undefined") {
      // Disable scrolling
      document.body.style.overflow = "hidden";
    }

    // Automatically redirect to the specified path if we have a valid authentication config
    if (nwcRequester && authConfig) {
      router.push(redirectTo);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "auto";
      }
    };
  }, [nwcRequester, authConfig, router, redirectTo]);

  return null;
}
