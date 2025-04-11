"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  GetBalanceResponse,
  GetInfoResponse,
  NwcRequester,
  UmaConnectButton,
  useNwcRequester,
  useOAuth,
} from "@uma-sdk/uma-auth-client";
import { APP_IDENTITY_PUBKEY, NOSTR_RELAY } from "@/utils/config";

type WalletWidgetProps = {
  viewportPrice?: number;
  pagePrice?: number;
  viewportsPaid?: number;
  totalViewports?: number;
  amountPaid?: number;
  btcPrice?: number | null;
  isPurchasing?: boolean;
  onUnlockPage?: () => void;
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  NGN: "₦",
  INR: "₹",
  KRW: "₩",
  CNY: "¥",
  RUB: "₽",
  BRL: "R$",
  AUD: "A$",
  CAD: "C$",
  CHF: "Fr",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
  HUF: "Ft",
  CZK: "Kč",
  ILS: "₪",
  PHP: "₱",
  THB: "฿",
  MYR: "RM",
  SGD: "S$",
  NZD: "NZ$",
  ZAR: "R",
  HKD: "HK$",
  MXN: "Mex$",
  TRY: "₺",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "﷼",
  KWD: "د.ك",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  LBP: "ل.ل",
  EGP: "ج.م",
  TWD: "NT$",
  VND: "₫",
  IDR: "Rp",
  PKR: "₨",
  BDT: "৳",
  LKR: "රු",
  NPR: "₨",
  MMK: "K",
  KHR: "៛",
  LAK: "₭",
  MNT: "₮",
  UZS: "лв",
  KZT: "₸",
  GEL: "₾",
  AMD: "֏",
  AZN: "₼",
  BYN: "Br",
  MDL: "L",
  RON: "lei",
  UAH: "₴",
  BGN: "лв",
  HRK: "kn",
  RSD: "дин",
  MKD: "ден",
  ALL: "L",
  BAM: "KM",
  SAT: "SAT",
};

function getCurrencySymbol(currencyCode: string): string {
  // First try the map
  if (CURRENCY_SYMBOLS[currencyCode]) {
    return CURRENCY_SYMBOLS[currencyCode];
  }

  // Fallback to Intl.NumberFormat
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    });
    const parts = formatter.formatToParts(1);
    const currencyPart = parts.find((part) => part.type === "currency");
    return currencyPart?.value || currencyCode;
  } catch (error) {
    console.error(
      `Error getting symbol for currency code ${currencyCode}:`,
      error
    );
    return currencyCode;
  }
}

export default function WalletWidget({
  viewportPrice = 0,
  pagePrice = 0,
  viewportsPaid = 0,
  totalViewports = 0,
  amountPaid = 0,
  btcPrice = 0,
  isPurchasing = false,
  onUnlockPage,
}: WalletWidgetProps) {
  const { nwcRequester } = useNwcRequester();
  const { authConfig, isConnectionValid, nwcConnectionUri } = useOAuth();
  const [balance, setBalance] = useState<GetBalanceResponse | undefined>();
  const [walletCurrency, setWalletCurrency] = useState<string | undefined>();
  const [info, setInfo] = useState<GetInfoResponse | undefined>();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [redirectUri, setRedirectUri] = useState<string>("");

  const fetchBalance = async (nwcRequester: NwcRequester) => {
    try {
      if (walletCurrency) {
        const res = await nwcRequester.getBalance({
          currency_code: walletCurrency,
        });
        setBalance(res);
      }
    } catch (e) {
      console.error(e);
      setBalance(undefined);
    }
  };

  const fetchInfo = async (nwcRequester: NwcRequester) => {
    try {
      const res = await nwcRequester.getInfo();
      setInfo(res);
      console.log(res?.currencies?.[0]?.currency.code);
      setWalletCurrency(res?.currencies?.[0]?.currency.code ?? "SAT");
      fetchBalance(nwcRequester);
    } catch (e) {
      console.error(e);
      setInfo(undefined);
    }
  };

  useEffect(() => {
    if (nwcRequester && authConfig && nwcConnectionUri && isConnectionValid()) {
      fetchInfo(nwcRequester);
    } else {
      setBalance(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nwcRequester,
    authConfig,
    amountPaid,
    walletCurrency,
    nwcConnectionUri,
    isConnectionValid,
  ]);

  useEffect(() => {
    // Set the redirect URI based on the current domain
    if (typeof window !== "undefined") {
      const currentDomain = window.location.origin;
      setRedirectUri(`${currentDomain}/pennywall`);
    }
  }, []);

  const handleBalanceClick = () => {
    setIsPopupVisible(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupVisible]);

  const handleUnlockPage = () => {
    if (onUnlockPage) {
      onUnlockPage();
    }
  };

  let formattedBalance = undefined;
  if (balance && btcPrice !== null && info && walletCurrency) {
    const isFiat = walletCurrency !== "SAT";
    const fiatBalance = isFiat
      ? (balance.balance / 100).toFixed(2)
      : balance.balance;
    const symbol = isFiat ? getCurrencySymbol(walletCurrency) : "SAT";
    formattedBalance = `${symbol}${fiatBalance}`;
  }

  return (
    <>
      <div className="flex flex-row justify-between space-x-4 bg-[#f9f9f9] p-2 pb-10 pl-4 shadow-sm md:z-[-100] md:rounded-full md:pb-2">
        <div
          className="flex cursor-pointer items-center"
          onClick={handleBalanceClick}
        >
          <Image src="/wallet.png" width={25} height={25} alt="wallet" />
          {isPurchasing ? (
            <span className="ml-2">
              <LoadingIndicator />
            </span>
          ) : (
            balance && (
              <span className="ml-2 text-sm font-semibold text-gray-800">
                {btcPrice !== null ? formattedBalance : "Loading..."}
              </span>
            )
          )}
        </div>
        <div className="font-normal">
          {redirectUri && (
            <UmaConnectButton
              app-identity-pubkey={APP_IDENTITY_PUBKEY}
              nostr-relay={NOSTR_RELAY}
              redirect-uri={redirectUri}
              required-commands={[
                "pay_invoice",
                "get_balance",
                "pay_to_address",
              ]}
              optional-commands={["list_transactions"]}
              budget-amount="10000"
              budget-currency="USD"
              budget-period="monthly"
              style={{
                "--uma-connect-background": "rgb(37, 99, 235)",
                "--uma-connect-radius": "50px",
                "--uma-connect-padding-x": "20px",
                "--uma-connect-padding-y": "6px",
                "--uma-connect-text-color": "#F9F9F9",
                "--uma-connect-font-size": "12px",
                "--uma-connect-font-weight": 300,
              }}
            />
          )}
        </div>
      </div>
      {isPopupVisible && (
        <div ref={popupRef} className="rounded-lg border bg-white p-6 md:mt-2">
          <h2 className="mb-4 text-lg">{window.location.href}</h2>
          <div className="mb-2 flex justify-between text-sm">
            <span>Viewports:</span>
            <span>
              {viewportsPaid}/{totalViewports}
            </span>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span>$ / Viewport</span>
            <span>${viewportPrice.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span>You&apos;ve Paid</span>
            <span>${amountPaid.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center">
            {amountPaid === pagePrice ? (
              <button
                className="mt-4 w-full cursor-not-allowed rounded-full bg-green-600 py-3 text-sm text-white"
                disabled
              >
                Page Purchased!
              </button>
            ) : (
              <button
                className="mt-4 flex w-full items-center justify-center rounded-full bg-brand py-3 text-sm text-white"
                onClick={handleUnlockPage}
              >
                {isPurchasing ? (
                  <div className="flex cursor-none flex-col items-center justify-center">
                    <LoadingIndicator />
                  </div>
                ) : (
                  `Unlock Entire Page for ${(pagePrice - amountPaid).toFixed(
                    2
                  )}`
                )}
              </button>
            )}
            <p className="mt-2 text-xs text-gray-500">
              This Page Costs <strong>${pagePrice.toFixed(2)}</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

const LoadingIndicator = () => (
  <svg
    aria-hidden="true"
    className="dark:white inline h-4 w-4 animate-spin fill-blue-600 text-white"
    viewBox="0 0 100 101"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <path
      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
      fill="currentColor"
    />
    <path
      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
      fill="currentFill"
    />
  </svg>
);
