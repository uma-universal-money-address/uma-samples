"use client";

import { useNwcRequester, useOAuth } from "@uma-sdk/uma-auth-client";

export const usePayToAddress = () => {
  const { nwcRequester } = useNwcRequester();
  const { authConfig } = useOAuth();

  const payToAddress = async (amountCents: number) => {
    if (!nwcRequester || !authConfig) {
      console.warn("No NwcRequester available.");
      return;
    }

    return await nwcRequester.payToAddress({
      receiver: { lud16: "$fun-star-496@test.uma.me" },
      sending_currency_code: "USD",
      sending_currency_amount: amountCents,
    });
  };

  return { payToAddress };
};
