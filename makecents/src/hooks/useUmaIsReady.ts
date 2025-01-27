import { useNwcRequester, useOAuth } from "@uma-sdk/uma-auth-client";
import { useEffect, useState } from "react";

export default function useUmaIsReady() {
  const { nwcRequester } = useNwcRequester();
  const { authConfig } = useOAuth();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("Updating isReady: ", nwcRequester !== undefined && authConfig !== undefined);
    setIsReady(nwcRequester !== undefined && authConfig !== undefined);
  }, [nwcRequester, authConfig]);

  return { isReady };
}