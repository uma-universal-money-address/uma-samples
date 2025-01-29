"use client";

import { useEffect, useState } from "react";
import PaymentIndicator from "./PaymentIndicator";

const ScrollIndicator = ({
  sectionDimensions,
  unlockedSectionIndex,
  paymentAmount,
}: {
  sectionDimensions: number[];
  unlockedSectionIndex: number;
  paymentAmount: number;
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? (
    <div className="fixed left-5 right-5 top-[60px] h-1 rounded-lg bg-gray-100">
      <div id="sections" className="absolute flex h-1 w-full flex-row">
        {sectionDimensions.map((width, i) => (
          <div
            key={i}
            className={`flex-grow ${
              i <= unlockedSectionIndex
                ? "bg-black"
                : i % 2 === 0
                  ? "bg-gray-200"
                  : "bg-gray-300"
            } ${
              i === 0
                ? "rounded-l-lg"
                : i === sectionDimensions.length - 1
                  ? "rounded-r-lg"
                  : ""
            }`}
            style={{
              width: `${(width / document.body.scrollHeight) * 100}%`,
            }}
          >
            {i === unlockedSectionIndex && (
              <div
                className={`text-grey absolute bottom-[-10px] rounded-full border bg-black px-3 py-1 text-xs text-white shadow-sm ${
                  i === 12 ? "right-[0px]" : ""
                }`}
              >
                ${paymentAmount.toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="fixed bottom-10 left-10 top-10 z-[-100] w-1 rounded-lg bg-gray-100">
      <div
        id="sections"
        className="absolute -z-10 flex h-full w-1 flex-col gap-1"
      >
        {sectionDimensions.map((height, i) => (
          <div
            key={i}
            className={`flex-grow ${
              i <= unlockedSectionIndex
                ? "bg-black"
                : i % 2 === 0
                  ? "bg-gray-200"
                  : "bg-gray-300"
            } ${
              i === 0
                ? "rounded-t-lg"
                : i === sectionDimensions.length - 1
                  ? "rounded-b-lg"
                  : ""
            }`}
            style={{
              height: `${(height / document.body.scrollHeight) * 100}%`,
            }}
          >
            {i === unlockedSectionIndex && (
              <PaymentIndicator paymentAmount={paymentAmount} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollIndicator;
