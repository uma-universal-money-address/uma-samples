/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { webln } from "@getalby/sdk";
import { NextResponse } from "next/server";
import { NwcRequester } from "@uma-sdk/uma-auth-client";
import { NOSTR_RELAY } from "@/utils/config";

import WebSocket from "ws";
// global.WebSocket = WebSocket as any;

async function umaPayment(
  umaAddress: string,
  amount: number,
  currency: string,
): Promise<any | Error> {
  if (!process.env.NWC_URL) {
    throw Error("Missing NWC_URL environment variable");
  }

  try {
    const nwc = new NwcRequester(process.env.NWC_URL, () => {});

    // const nwc = new webln.NWC({
    //   nostrWalletConnectUrl: process.env.NWC_URL,
    //   relayUrl: "wss://relay.getalby.com",
    // });

    // await nwc.enable();

    // console.log("Attempting payment...");
    // console.log("Payload:", {
    //   receiver: { lud16: umaAddress },
    //   sending_currency_code: currency,
    //   sending_currency_amount: amount,
    // });

    // const response = await nwc.payToAddress({
    //   receiver: { lud16: umaAddress },
    //   sending_currency_code: currency,
    //   sending_currency_amount: amount,
    // });
return null;
    // return response;
  } catch (error) {
    console.error("Payment failed: ", error);
    throw new Error("Payment failed");
  }
}

export async function POST(req: Request) {
  const { umaAddress } = await req.json();
  const amount = 100;
  const currency = "SAT";

  if (!umaAddress || !amount || !currency) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    // Placeholder
    // const paymentResponse = { paid: 10, address: umaAddress };
    const paymentResponse = await umaPayment(umaAddress, amount, currency);
    
    console.log(JSON.stringify(paymentResponse));

    return NextResponse.json(
      { message: "Payment successful", data: paymentResponse },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment failed", message: JSON.stringify(error) },
      { status: 500 },
    );
  }
}
