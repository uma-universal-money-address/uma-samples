"use client";

import { Toaster, toast } from 'sonner'
import React from "react";
import dynamic from "next/dynamic";
import useUmaIsReady from "@/hooks/useUmaIsReady";
import { useEffect, useState, useRef } from "react";
import {
  LightsparkLogoIcon,
  MakeCentsIcon,
  MakeCentsStill,
  ThumbsDownIcon,
  ThumbsDownLightIcon,
  ThumbsUpIcon,
  ThumbsUpLightIcon,
} from "../components/Icons";
import { MakeCentsPlayer } from "./MakeCentsPlayer";
import {
  APP_IDENTITY_PUBKEY,
  MAKE_CENTS_SOURCE,
  NOSTR_RELAY,
} from "@/utils/config";
import { BottomQuestionnaire, InsetQuestionnaire } from "./Questionnaire";
import WalletWidget from "./WalletWidget";
import { useNwcRequester } from "@uma-sdk/uma-auth-client";
import { useSearchParams } from 'next/navigation';

const UmaConnectButton = dynamic(
  () => import("@uma-sdk/uma-auth-client").then((mod) => mod.UmaConnectButton),
  { ssr: false },
);

export default function Page() {
  const { isReady } = useUmaIsReady();
  const { nwcRequester } = useNwcRequester();
  const [isPurchasing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [hidePlayerControls, setHidePlayuerControls] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [acc, setAcc] = useState<number | null>(null);
  const [redirectUri, setRedirectUri] = useState("");
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const walletWidgetRef = useRef<{ refetchBalance: () => void } | null>(null);
  const playerRef = useRef<{ restartVideo: () => void } | null>(null);

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/`);
  }, []);

  const fetchBitcoinData = () => {
    if (btcPrice) {
      console.log("Price already fetched");
      return;
    }
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    )
      .then((response) => response.json())
      .then((priceData) => {
        const currentPrice = priceData.bitcoin.usd.toFixed(2);
        setBtcPrice(currentPrice);
        console.log("Setting BTC price: ", currentPrice);
      })
      .catch((e) => {
        console.log("Error setting BTC price: ", e);
        setBtcPrice(null);
      });
  };

  const disconnect = async () => {
    if (!isReady) {
      console.log("NWC or AuthConfig is nil");
      return;
    }
  };

  const onStart =() => {
    reward()
  }

  const onProgressUpdate = async (progress: number) => {
    console.log(`Progress: ${progress}`);

    if (progress >= 100) {
      setIsVideoCompleted(true);
      setHidePlayuerControls(true);
    }

    reward();
  }

  const reward = async () => {
    try {
      const address = await nwcRequester.getInfo();

      const response = await fetch("/api/reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ umaAddress: address?.lud16 }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Reward response:", data);

      const amount = data.data.quote.total_receiving_amount;
      console.log(amount);
      setAcc(acc + amount);

      if (walletWidgetRef.current) {
        walletWidgetRef.current.refetchBalance();
      }
    } catch (error) {
      console.error("Error calling /api/reward:", error);
    }
  };

  useEffect(() => {
    if (btcPrice === null) {
      fetchBitcoinData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btcPrice]);

  const convertSatsToDollars = (sats: number, btcPrice: number): number => {
    const btcAmount = sats / 100000000;
    return btcAmount * btcPrice;
  };

  
  const queryParams = useSearchParams();
  const umaAddress = queryParams.get('uma');

  return (
    <>
    <Toaster position="top-center" richColors />
    <div className="w-full flex justify-between p-[12px] bg-[#F9F9F9] border-b-[0.5px] border-b-[#C0C9D6]">
      <div className="flex items-center gap-[8px]">
        <img src="/makecents.png" className="w-[32px]"/>
        <span className="hidden md:block text-[14px] font-bold">Makescents Demo</span>
      </div>
      {umaAddress && (
        <button
          className="flex items-center gap-[8px] hover:opacity-50"
        onClick={() => {
          navigator.clipboard.writeText(`${umaAddress ?? "you"}@test.uma.me`);
          toast(
            <span>
              <strong>${umaAddress ?? "you"}@test.uma.me</strong> copied to clipboard
            </span>,
            {
              duration: 1000,
            }
          );
        }}
      >
        <span className="text-[14px] font-bold">${umaAddress ?? "you"}@test.uma.me</span>
          <img src="/copy.svg" className="w-[24px] md:w-[28px] block" />
        </button>
      )}
    </div>


    <div className="md:p-8 md:pb-[128px]">
      {isModalVisible && (
        <IntroModal
          onAction={() => setIsModalVisible(false)}
          onDisconnect={disconnect}
        />
      )}
      <div
        className={`mx-auto ${isReady ? "mt-[70px]" : "mt-[0px]"} flex flex-col md:mt-[0px] md:max-w-[1166px]`}
      >
        <div className="fixed top-0 z-[10] w-full justify-end md:relative md:flex md:pt-[40px] md:pb-[20px]">
          {isReady && (
            <WalletWidget
              ref={walletWidgetRef}
              btcPrice={btcPrice}
              isPurchasing={isPurchasing}
            />
          )}
        </div>
        <div className="relative rounded-[40px] md:border-[1px] md:border-[#EFEFEF]">
          {isReady ? (
            <>
              <InsetQuestionnaire
                isVideoCompleted={isVideoCompleted}
                onWatchAgain={() => {
                  if (playerRef.current) {
                    playerRef.current.restartVideo();
                    setIsVideoCompleted(false);
                    setHidePlayuerControls(false);
                  }
                }}
              />
              <MakeCentsPlayer
                ref={playerRef}
                videoSrc={MAKE_CENTS_SOURCE}
                earnedAmount={
                  acc && btcPrice ? convertSatsToDollars(acc, btcPrice) : 0
                }
                onStart={onStart}
                onProgressUpdate={onProgressUpdate}
                showControls={!hidePlayerControls}
              />
            </>
          ) : (
            <>
              <div className="absolute flex h-full w-full items-center justify-center">
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
                    "--uma-connect-padding-x": "32px",
                    "--uma-connect-padding-y": "16px",
                    "--uma-connect-text-color": "#F9F9F9",
                    "--uma-connect-font-size": "16px",
                    display: redirectUri ? "block" : "hidden",
                  }}
                />
              </div>
              <div className="inset-0 md:p-[20px] overflow-hidden">
                <MakeCentsStill className="md:rounded-[20px] h-full w-full md:shadow-lg" />
              </div>
            </>
          )}
        </div>
        <CommentSection />
        <BottomQuestionnaire
          isVideoCompleted={isVideoCompleted}
          onWatchAgain={() => {
            if (playerRef.current) {
              playerRef.current.restartVideo();
              setIsVideoCompleted(false);
              setHidePlayuerControls(false);
            }
          }}
        />
      </div>
    </div>
    </>
  );
}

const CommentSection = () => {
  const profileColors = ["#00887A", "#F8775E", "#4288D8"];
  return (
    <div className="mx-auto flex h-full w-full flex-col gap-[24px] bg-[#121212] p-[24px] pt-[48px] text-white md:w-[750px] md:bg-white md:text-black">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Get on the Moneygrid</h2>
          <p className="text-sm text-[rgba(255,255,255,0.4)] md:text-[#121212]">
            10K views · 1 day ago
          </p>
        </div>
      </div>
      <div className="border-1 mb-4 flex items-center border-b-2 border-[rgba(255,255,255,0.1)] pb-[24px] md:border-[rgba(0,0,0,0.1)]">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center justify-center gap-[12px]">
            <LightsparkLogoIcon />
            <div className="flex flex-row items-center justify-center gap-[12px]">
              <p className="text-sm font-semibold">Lightspark</p>
              <p className="text-sm text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                352K
              </p>
            </div>
          </div>
          <div className="rounded-full bg-[rgba(255,255,255,0.1)] px-[20px] py-[8px] text-sm text-white md:bg-gray-200 md:text-black">
            Learn More
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {/* Comment 1 */}
        <div className="flex items-start space-x-3">
          <div
            className="flex min-h-[32px] min-w-[32px] h-[32px] w-[32px] items-center justify-center rounded-full"
            style={{ backgroundColor: "#FF5733" }} // example color
          >
            <span className="font-bold text-white">A</span>
          </div>
          <div>
            <div className="flex flex-row gap-[8px] items-center">
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                @theauthdude
              </p>
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                1 hour ago
              </p>
            </div>
            <p className="mt-1 text-[14px] font-[500]">
              Just earned sats for watching this — feels wild not waiting 3 days for a wire.
            </p>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <ThumbsUpLightIcon className="md:hidden" />
              <ThumbsUpIcon className="hidden md:block" />
              <span className="text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">24</span>
              <ThumbsDownLightIcon className="md:hidden" />
              <ThumbsDownIcon className="hidden md:block" />
            </div>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex items-start space-x-3">
          <div
            className="flex min-h-[32px] min-w-[32px] h-[32px] w-[32px] items-center justify-center rounded-full"
            style={{ backgroundColor: "#33C1FF" }}
          >
            <span className="font-bold text-white">B</span>
          </div>
          <div>
            <div className="flex flex-row gap-[8px] items-center">
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                @btxn
              </p>
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                1 hour ago
              </p>
            </div>
            <p className="mt-1 text-[14px] font-[500]">
              Loving how UMA pays mid-video. Got a ping the second I crossed 0:30. 🔥
            </p>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <ThumbsUpLightIcon className="md:hidden" />
              <ThumbsUpIcon className="hidden md:block" />
              <span className="text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">17</span>
              <ThumbsDownLightIcon className="md:hidden" />
              <ThumbsDownIcon className="hidden md:block" />
            </div>
          </div>
        </div>

        {/* Comment 3 */}
        <div className="flex items-start space-x-3">
          <div
            className="flex min-h-[32px] min-w-[32px] h-[32px] w-[32px] items-center justify-center rounded-full"
            style={{ backgroundColor: "#28B463" }}
          >
            <span className="font-bold text-white">C</span>
          </div>
          <div>
            <div className="flex flex-row gap-[8px] items-center">
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                @chainblock
              </p>
              <p className="text-[12px] font-[500] text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">
                1 hour ago
              </p>
            </div>
            <p className="mt-1 text-[14px] font-[500]">
              If you're watching this and not connected to UMA… you're leaving money on the table 👀
            </p>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <ThumbsUpLightIcon className="md:hidden" />
              <ThumbsUpIcon className="hidden md:block" />
              <span className="text-[rgba(255,255,255,0.4)] md:text-[rgba(0,0,0,0.4)]">12</span>
              <ThumbsDownLightIcon className="md:hidden" />
              <ThumbsDownIcon className="hidden md:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IntroModal = ({ onAction = () => {}, onDisconnect = () => {} }) => {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black bg-opacity-75 md:items-center">
      <div className="rounded-t-2xl bg-white p-6 pt-10 text-center md:max-w-[400px] md:rounded-2xl">
        <div className="mb-4">
          <MakeCentsIcon className="mx-auto h-20 w-20" />
        </div>
        <h2 className="mb-4 text-xl font-bold">Welcome to MakeCents</h2>
        <p className="mb-6">
          This a demo example of how you can get paid to watch ads, instead of
          just get annoyed by them. The longer you watch the video the more
          money you will earn.
        </p>
        <div className="flex flex-col">
          <div
            className="mb-2 flex h-[56px] items-center justify-center rounded-full bg-black px-4 py-2 leading-[24px] text-white hover:cursor-pointer active:cursor-pointer"
            onClick={onAction}
          >
            Let&apos;s Do It
          </div>
          <button className="px-4 py-2 text-black" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};
