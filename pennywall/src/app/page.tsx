"use client";

import { APP_IDENTITY_PUBKEY, NOSTR_RELAY } from "@/utils/config";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Redirector = dynamic(() => import("@/components/Redirector"), {
  ssr: false,
});
const Paper = dynamic(() => import("@/app/Paper"), { ssr: false });
const UmaConnectButton = dynamic(
  () => import("@uma-sdk/uma-auth-client").then((mod) => mod.UmaConnectButton),
  { ssr: false },
);

export default function Page() {
  const [redirectUri, setRedirectUri] = useState("");

  useEffect(() => {
    setRedirectUri(`${window.location.origin}`);
  }, []);

  return (
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
            required-commands={["pay_invoice", "get_balance", "pay_to_address"]}
            optional-commands={["list_transactions"]}
            budget-amount="1000"
            budget-currency="USD"
            budget-period="monthly"
            style={{
              "--uma-connect-background": "rgb(37, 99, 235)",
              "--uma-connect-radius": "50px",
              "--uma-connect-padding-x": "20px",
              "--uma-connect-padding-y": "6px",
              "--uma-connect-text-color": "#F9F9F9",
              "--uma-connect-font-size": "12px",
            }}
          />
        )}
      </div>
    </div>
  );
}
