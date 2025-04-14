"use client";

import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  GetBalanceResponse,
  GetInfoResponse,
  NwcRequester,
  UmaConnectButton,
  useNwcRequester,
  useOAuth,
} from "@uma-sdk/uma-auth-client";
import { APP_IDENTITY_PUBKEY, NOSTR_RELAY } from "@/utils/config";

import Wallet from "/public/svgs/wallet.svg";
import WalletDark from "/public/svgs/walletDark.svg";

type WalletWidgetProps = {
  btcPrice?: number | null;
  isPurchasing?: boolean;
};

const WalletWidget = forwardRef(
  ({ btcPrice = 0, isPurchasing = false }: WalletWidgetProps, ref) => {
    const { nwcRequester } = useNwcRequester();
    const { authConfig, isConnectionValid, nwcConnectionUri } = useOAuth();
    const [balance, setBalance] = useState<GetBalanceResponse | undefined>();
    const [walletCurrency, setWalletCurrency] = useState<string | undefined>();
    const [info, setInfo] = useState<GetInfoResponse | undefined>();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const [redirectUri, setRedirectUri] = useState<string>("https://makecents.uma.me");

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

    useImperativeHandle(ref, () => ({
      refetchBalance: () => {
        console.log("Refetching via ref");
        if (
          nwcRequester &&
          authConfig &&
          nwcConnectionUri &&
          isConnectionValid()
        ) {
          fetchBalance(nwcRequester);
        }
      },
    }));

    const fetchInfo = async (nwcRequester: NwcRequester) => {
      try {
        const res = await nwcRequester.getInfo();
        setInfo(res);
        setWalletCurrency(res?.currencies?.[0]?.currency.code ?? "SAT");
        fetchBalance(nwcRequester);
      } catch (e) {
        console.error(e);
        setInfo(undefined);
      }
    };

    useEffect(() => {
      if (
        nwcRequester &&
        authConfig &&
        nwcConnectionUri &&
        isConnectionValid()
      ) {
        fetchInfo(nwcRequester);
      } else {
        setBalance(undefined);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      nwcRequester,
      authConfig,
      nwcConnectionUri,
      isConnectionValid,
      walletCurrency,
    ]);

    useEffect(() => {
      // Set the redirect URI based on the current domain
      if (typeof window !== "undefined") {
        const currentDomain = window.location.origin;
        setRedirectUri(`${currentDomain}/`);
      }
    }, []);

    const handleBalanceClick = () => {
      setIsPopupVisible(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
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

    const convertSatsToUsd = (sats: number, btcPrice: number) => {
      const btcAmount = sats / 100000000;
      return btcAmount * btcPrice;
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

    let formattedBalance = undefined;
    if (balance && btcPrice !== null && info && walletCurrency) {
      const isFiat = walletCurrency !== "SAT";
      const fiatBalance = isFiat
        ? (balance.balance / 100).toFixed(2)
        : balance.balance;
      const symbol = isFiat ? getCurrencySymbol(walletCurrency) : "SAT";
      formattedBalance = `${symbol}${fiatBalance}`;
    }

    // const [buttonHeight, setButtonHeight] = useState("32px");

    // useEffect(() => {
    //   const updateButtonHeight = () => {
    //     console.log("Updating button height");
    //     if (window.innerWidth < 768) {
    //       setButtonHeight("32px");
    //     } else {
    //       setButtonHeight("40px");
    //     }
    //   };

    //   updateButtonHeight();

    //   window.addEventListener("resize", updateButtonHeight);
    //   return () => {
    //     window.removeEventListener("resize", updateButtonHeight);
    //   };
    // }, []);

    return (
      <>
        <div className="flex flex-row justify-between space-x-4 bg-[#121212] p-4 shadow-sm md:z-[-100] md:m-2 md:rounded-full md:bg-[#f9f9f9] md:p-2 md:pl-4">
          <div className="flex items-center" onClick={handleBalanceClick}>
            <Wallet className="h-[16px] w-[16px] md:hidden" />
            <WalletDark className="hidden md:block" />
            {isPurchasing ? (
              <span className="ml-2">
                <LoadingIndicator />
              </span>
            ) : (
              balance && (
                <span className="ml-2 text-[14px] font-bold text-white md:text-[#161718]">
                  {btcPrice !== null ? formattedBalance : "Loading..."}
                </span>
              )
            )}
          </div>
          <div className="font-normal">
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
              budget-amount="1000"
              budget-currency="USD"
              budget-period="monthly"
              style={{
                "--uma-connect-background": "rgb(37, 99, 235)",
                "--uma-connect-radius": "50px",
                "--uma-connect-padding-x": "20px",
                "--uma-connect-padding-y": "8px",
                "--uma-connect-text-color": "#F9F9F9",
                "--uma-connect-font-family": "Manrope, sans-serif",
                "--uma-connect-font-size": "14px",
                "--uma-connect-font-weight": 700,
                display: redirectUri ? "block" : "none",
              }}
            />
          </div>
        </div>
      </>
    );
  }
);

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

WalletWidget.displayName = "WalletWidget";

export default WalletWidget;
