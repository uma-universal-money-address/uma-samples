"use client";

import { useNwcRequester, GetInfoResponse } from "@uma-sdk/uma-auth-client";
import { useGetInfo } from "./useGetInfo";
import { useState } from "react";

export const usePayToAddress = () => {
  const { nwcRequester } = useNwcRequester();
  const { getInfo } = useGetInfo();
  const [info, setInfo] = useState<GetInfoResponse | undefined>();

  const payToAddress = async (amountCents: number, btcPrice: number) => {
    if (!nwcRequester) {
      console.warn("No NwcRequester available.");
      return;
    }

    if (!info) {
      const info = await getInfo();
      setInfo(info);
    }

    const infoCurrencies = info?.currencies ?? [];
    const sendAsSats =
      infoCurrencies.length === 0 || infoCurrencies[0]?.currency.code === "SAT";
    let amountToSend = amountCents;
    if (sendAsSats) {
      const amountInSats = Math.round(
        (amountCents / 100) * btcPrice * 10000000
      );
      amountToSend = amountInSats * 1000; // Sends as msats
    }

    return await nwcRequester.payToAddress({
      receiver: { lud16: "$fun-star-496@test.uma.me" },
      sending_currency_code: sendAsSats ? "SAT" : "USD",
      sending_currency_amount: amountToSend,
    });
  };

  return { payToAddress };
};
