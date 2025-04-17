"use client";

import { useNwcRequester } from "@uma-sdk/uma-auth-client";


export const usePayToAddress = () => {
  const { nwcRequester } = useNwcRequester();

  const payToAddress = async (amountCents: number) => {
    if (!nwcRequester) {
      console.warn("No NwcRequester available.");
      return;
    }

    console.log("Sending Cents:", amountCents);

    return await nwcRequester.payToAddress({
      receiver: { lud16: "$fun-star-496@test.uma.me" },
      sending_currency_code: "USD",
      sending_currency_amount: amountCents,
    });
  };

  return { payToAddress };
};
