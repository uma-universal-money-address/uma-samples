"use client";

import { useNwcRequester } from "@uma-sdk/uma-auth-client";

export const useGetInfo = () => {
  const { nwcRequester } = useNwcRequester();

  const getInfo = async () => {
    if (!nwcRequester) {
      console.warn("No NwcRequester available.");
      return;
    }

    return await nwcRequester.getInfo();
  };

  return { getInfo };
};
