"use client";

import { useNwcRequester } from "@uma-sdk/uma-auth-client";

export const usePayToAddress = () => {
  const { nwcRequester } = useNwcRequester();

  const payToAddress = async (amount: number) => {
    if (!nwcRequester) {
      console.warn("No NwcRequester available.");
      return;
    }

    return await nwcRequester.payToAddress({
      receiver: { lud16: "$fun-star-496@test.uma.me" },
      sending_currency_code: "SAT",
      sending_currency_amount: amount,
    });
  };

  return { payToAddress };
};
