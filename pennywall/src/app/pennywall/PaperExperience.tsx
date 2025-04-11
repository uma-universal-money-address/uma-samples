"use client";

import IntroModal from "@/app/pennywall/IntroModal";
import LoadingOverlay from "@/components/LoadingOverlay";
import Paper from "@/app/pennywall/Paper";
import dynamic from "next/dynamic";
import { usePayToAddress } from "@/hooks/usePayToAddress";
import useUmaIsReady from "@/hooks/useUmaIsReady";
import { useCallback, useEffect, useState } from "react";

const ScrollIndicator = dynamic(
  () => import("@/app/pennywall/ScrollIndicator"),
  {
    ssr: false,
  }
);

const WalletWidget = dynamic(() => import("@/app/pennywall/WalletWidget"), {
  ssr: false,
});

const VIEWPORT_PRICE_USD = 0.01;
const VIEWPORT_COUNT = 9;

export default function Page() {
  // Scroll State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sectionDimensions, setSectionDimensions] = useState<number[]>([]);

  // ScrollIndicator State
  const [desiredSectionIndex, setDesiredSectionIndex] = useState(1);
  const [availableSectionIndex, setAvailableSectionIndex] = useState(1);
  const [pageUnlocked, setPageUnlocked] = useState(false);

  // WalletWidget State
  const [purchasingViewports, setPurchasingViewports] = useState<Set<number>>(
    new Set()
  );
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [totalViewports] = useState(VIEWPORT_COUNT);
  const [viewportPrice] = useState(VIEWPORT_PRICE_USD);
  const [pagePrice] = useState(VIEWPORT_PRICE_USD * VIEWPORT_COUNT);
  const [amountPaid, setAmountPaid] = useState(0.0);

  // UMA Hooks
  const { isReady } = useUmaIsReady();
  const { payToAddress } = usePayToAddress();

  // Price State
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  const fetchBitcoinData = () => {
    if (btcPrice) {
      console.log("Price already fetched");
      return;
    }
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
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

  const purchaseViewport = useCallback(async () => {
    if (!isReady) {
      throw "NWC or AuthConfig is nil";
    }
    if (!btcPrice) {
      console.error("BTC price is not set");
      return;
    }

    const centsToSend = Math.round(VIEWPORT_PRICE_USD * 100);
    console.log("Sending USD: ", VIEWPORT_PRICE_USD);

    console.log(`Attempting to send $${VIEWPORT_PRICE_USD}`);
    await payToAddress(centsToSend, btcPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, btcPrice]);

  const purchaseRemainderOfPage = async () => {
    if (!isReady) {
      throw "NWC or AuthConfig is nil";
    }
    if (!btcPrice) {
      console.error("BTC price is not set");
      return;
    }

    const remainingPrice = pagePrice - amountPaid;

    console.log(
      `Attempting to send $${remainingPrice.toFixed(
        2
      )} for the remainder of the page`
    );

    try {
      setPurchasingViewports((prev) => new Set(prev).add(VIEWPORT_COUNT + 1));
      await payToAddress(Math.round(remainingPrice * 100), btcPrice);
      setPageUnlocked(true);
      setAmountPaid(pagePrice);
      setAvailableSectionIndex(VIEWPORT_COUNT + 1);
    } catch (e) {
      console.log("Failed to purchase remainder of the page: ", e);
    } finally {
      setPurchasingViewports((prev) => {
        const s = new Set(prev);
        s.delete(VIEWPORT_COUNT + 1);
        return s;
      });
    }
  };

  const disconnect = async () => {
    if (!isReady) {
      console.log("NWC or AuthConfig is nil");
      return;
    }
  };

  useEffect(() => {
    (async () => {
      if (desiredSectionIndex > 1 && !pageUnlocked) {
        console.log("New desired section index:", desiredSectionIndex);
        try {
          setPurchasingViewports((prev) =>
            new Set(prev).add(desiredSectionIndex)
          );
          await purchaseViewport();
          setAmountPaid(() => viewportPrice * (desiredSectionIndex - 1));
          setAvailableSectionIndex(desiredSectionIndex);
          if (desiredSectionIndex == 10) {
            setPageUnlocked(true);
            setAmountPaid(pagePrice);
            setAvailableSectionIndex(VIEWPORT_COUNT + 1);
          }
        } catch (e) {
          console.log("Failed to purchase viewport: ", e);
        } finally {
          setPurchasingViewports((prev) => {
            const s = new Set(prev);
            s.delete(desiredSectionIndex);
            return s;
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredSectionIndex]);

  useEffect(() => {
    // Fetch BTC price information
    if (btcPrice === null) {
      fetchBitcoinData();
    }

    // Derive viewport dimensions if not already set
    if (typeof window !== "undefined") {
      const sections = document.querySelectorAll("article > section");
      const dimensions = Array.from(sections).map(
        (section) => section.clientHeight
      );
      setSectionDimensions(dimensions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsPurchasing(purchasingViewports.size > 0);
  }, [purchasingViewports]);

  return (
    <div className="flex">
      <LoadingOverlay />
      {isModalVisible && (
        <IntroModal
          onAction={() => setIsModalVisible(true)}
          onDisconnect={disconnect}
        />
      )}
      <div className="fixed left-0 top-0 w-full md:left-auto md:right-5 md:top-5 md:w-auto">
        <WalletWidget
          viewportPrice={viewportPrice}
          pagePrice={pagePrice}
          viewportsPaid={availableSectionIndex - 1}
          totalViewports={totalViewports}
          amountPaid={amountPaid}
          onUnlockPage={purchaseRemainderOfPage}
          btcPrice={btcPrice}
          isPurchasing={isPurchasing}
        />
        <ScrollIndicator
          sectionDimensions={sectionDimensions}
          unlockedSectionIndex={availableSectionIndex - 1}
          paymentAmount={amountPaid}
        />
      </div>
      <div id="paper" className="z-[-100] mx-auto max-w-2xl p-5 pt-12">
        <Paper
          availableSections={availableSectionIndex}
          setAvailableSections={setDesiredSectionIndex}
        />
      </div>
    </div>
  );
}
