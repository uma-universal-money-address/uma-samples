"use client";

import { useNwcRequester } from "@uma-sdk/uma-auth-client";


export const usePayToAddress = () => {
  const { nwcRequester } = useNwcRequester();

  const payToAddress = async (amountCents: number, senderCurrency: string) => {
    if (!nwcRequester) {
      console.warn("No NwcRequester available.");
      return;
    }

    console.log("Sending ", amountCents, " ", senderCurrency);

    return await nwcRequester.payToAddress({
      receiver: { lud16: "$receiver@localhost:4000" },
      sending_currency_code: "USD",
      sending_currency_amount: amountCents,
    });
  };

  return { payToAddress };
};
