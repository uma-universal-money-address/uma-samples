import React from "react";
import { PennywallIcon } from "../../components/Icons";

export default function IntroModal({
  onAction = () => {},
  onDisconnect = () => {},
}) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="max-w-md rounded-2xl bg-white p-6 pt-10 text-center">
        <div className="mb-4">
          <PennywallIcon className="mx-auto h-20 w-20" />
        </div>
        <h2 className="mb-4 text-xl font-bold">How Pennywall works</h2>
        <p className="mb-6">
          This is a demo example of how you can pay for content online in a
          whole new way. As you scroll down the page, you can in this demo, we
          will show you how you can unlock content without a paywall. As you
          scroll down the page, you will be able to unlock content each time you
          reach the end of one viewport&apos;s height.
        </p>
        <div className="flex flex-col">
          <button
            className="mb-2 rounded-lg bg-pink-500 px-4 py-2 text-white"
            onClick={onAction}
          >
            Let&apos;s Do It
          </button>
          <button className="px-4 py-2 text-black" onClick={onDisconnect}>
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
