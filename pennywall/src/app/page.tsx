"use client";
import { Toaster, toast } from 'sonner'
import { APP_IDENTITY_PUBKEY, NOSTR_RELAY } from "@/utils/config";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';

const Redirector = dynamic(() => import("@/components/Redirector"), {
  ssr: false,
});
const Paper = dynamic(() => import("@/app/pennywall/Paper"), { ssr: false });
const UmaConnectButton = dynamic(
  () => import("@uma-sdk/uma-auth-client").then((mod) => mod.UmaConnectButton),
  { ssr: false },
);

const Header = () => {
  const queryParams = useSearchParams();
  const umaAddress = queryParams.get('uma');

  return umaAddress ? (
    <button
      className="flex items-center gap-[8px] hover:opacity-50"
    onClick={() => {
      navigator.clipboard.writeText(`${umaAddress}@test.uma.me`);
      toast(
        <span>
          <strong>${umaAddress}@test.uma.me</strong> copied to clipboard
        </span>,
        {
          duration: 1000,
        }
      );
    }}
  >
    <span className="text-[14px] font-bold">${umaAddress}@test.uma.me</span>
      <img src="/copy.svg" className="w-[24px] md:w-[28px] block" />
    </button>
  ) : null;
};

export default function Page() {
  const [redirectUri, setRedirectUri] = useState("https://pennywall.uma.me/pennywall");

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/pennywall`);
  }, []);

  return (
    <>
    <Toaster position="top-center" richColors />
    <div className="w-full flex justify-between p-[12px] bg-[#F9F9F9] border-b-[0.5px] border-b-[#C0C9D6]">
      <div className="flex items-center gap-[8px]">
        <img src="/pennywall.png" className="w-[32px]"/>
        <span className="hidden md:block text-[14px] font-bold">Pennywall Demo</span>
      </div>
      <Suspense>
        <Header />
      </Suspense>
    </div>
    <div className="relative min-h-screen">
      <Redirector />
      <div id="paper" className="mx-auto max-w-2xl p-5 pt-12">
        <Paper availableSections={1} setAvailableSections={() => {}} />
      </div>
      <div className="fixed bottom-0 left-0 flex h-1/3 min-h-[200px] w-full items-center justify-center bg-opacity-10 backdrop-blur-[10px] backdrop-filter" />
      <div className="fixed bottom-0 flex h-1/3 min-h-[200px] w-full items-center justify-center">
        {redirectUri && (
          <UmaConnectButton
            app-identity-pubkey={APP_IDENTITY_PUBKEY}
            nostr-relay={NOSTR_RELAY}
            redirect-uri={redirectUri}
            required-commands={["get_balance", "pay_to_address"]}
            optional-commands={["list_transactions"]}
            budget-amount="1000"
            budget-currency="USD"
            budget-period="monthly"
            style={{
              "--uma-connect-background": "rgb(37, 99, 235)",
              "--uma-connect-radius": "999px",
              "--uma-connect-padding-x": "32px",
              "--uma-connect-padding-y": "16px",
              "--uma-connect-text-color": "#F9F9F9",
              "--uma-connect-font-size": "16px",
            }}
          />
        )}
      </div>
    </div>
    </>
  );
}
