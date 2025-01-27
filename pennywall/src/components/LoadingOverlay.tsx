"use client";

import { useNwcRequester, useOAuth } from "@uma-sdk/uma-auth-client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

const LoadingOverlay = () => {
  const { nwcRequester } = useNwcRequester();
  const { authConfig } = useOAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (nwcRequester && authConfig) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        if (isLoading) {
          router.push("/");
        }
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [nwcRequester, authConfig, isLoading, router]);

  return isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-lg text-white">Loading...</div>
    </div>
  ) : null;
};

export default LoadingOverlay;
