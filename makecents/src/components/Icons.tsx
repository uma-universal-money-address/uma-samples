"use client";

import React from "react";

const Icon = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={`icon ${className}`} />
);

export const ChevronBottomIcon = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/chevronBottom.svg"
    alt="Chevron Bottom"
    className={className}
  />
);

export const DiscordLargeIcon = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/discordLarge.svg"
    alt="Discord Large"
    className={className}
  />
);

export const GamepadIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/gamepad.svg" alt="Gamepad" className={className} />
);

export const GithubIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/githubIcon.svg" alt="Github" className={className} />
);

export const GithubLargeIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/githubLarge.svg" alt="Github Large" className={className} />
);

export const GlobeIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/globe.svg" alt="Globe" className={className} />
);

export const GlobeDarkIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/globeDark.svg" alt="Globe Dark" className={className} />
);

export const WalletIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/wallet.svg" alt="Wallet" className={className} />
);

export const HamburgerIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/hamburger.svg" alt="Hamburger" className={className} />
);

export const LanguagesIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/languages.svg" alt="Languages" className={className} />
);

export const LogoIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/logo.svg" alt="Logo" className={className} />
);

export const LogoDarkIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/logoDark.svg" alt="Logo Dark" className={className} />
);

export const MessageIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/message.svg" alt="Message" className={className} />
);

export const PayAnyoneIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/payAnyone.svg" alt="Pay Anyone" className={className} />
);

export const PennywallIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/pennywallIcon.svg" alt="Pennywall" className={className} />
);

export const MakeCentsIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/makeCents.svg" alt="MakeCents" className={className} />
);

export const MakeCentsPlaceholder = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/makeCentsPlaceholder.svg"
    alt="MakeCents Placeholder"
    className={className}
  />
);

export const MakeCentsStill = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/makeCentsStill.svg"
    alt="MakeCents Still"
    className={className}
  />
);

export const ThumbsUpIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/thumbsUp.svg" alt="Thumbs Up" className={className} />
);

export const ThumbsDownIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/thumbsDown.svg" alt="Thumbs Down" className={className} />
);

export const ThumbsUpLightIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/thumbsUpLight.svg" alt="Thumbs Up" className={className} />
);

export const ThumbsDownLightIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/thumbsDownLight.svg" alt="Thumbs Down" className={className} />
);

export const RefreshIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/refresh.svg" alt="Refresh" className={className} />
);

export const PlaygroundIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/playgroundIcon.svg" alt="Playground" className={className} />
);

export const LightsparkLogoIcon = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/lightsparkLogo.svg"
    alt="Lightspark Logo"
    className={className}
  />
);

export const SeamlessCheckoutIcon = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/seamlessCheckout.svg"
    alt="Seamless Checkout"
    className={className}
  />
);

export const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/shoppingBag.svg" alt="Shopping Bag" className={className} />
);

export const TerminalIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/terminalIcon.svg" alt="Terminal" className={className} />
);

export const UnlockInnovativeIcon = ({ className }: { className?: string }) => (
  <Icon
    src="/svgs/unlockInnovative.svg"
    alt="Unlock Innovative"
    className={className}
  />
);

export const CloseIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/close.svg" alt="Close" className={className} />
);

export const CopyIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/copy.svg" alt="Copy" className={className} />
);

export const PencilIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/pencil.svg" alt="Pencil" className={className} />
);

export const SparklesIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/sparkles.svg" alt="Sparkles" className={className} />
);

export const DollarIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/dollar.svg" alt="Dollar" className={className} />
);

export const ChevronBack = ({ className }: { className?: string }) => (
  <Icon src="/svgs/chevronBack.svg" alt="Back" className={className} />
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/play.svg" alt="Play" className={className} />
);

export const PauseIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/pause.svg" alt="Pause" className={className} />
);

export const StarIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/star.svg" alt="Star" className={className} />
);

export const ExpandIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/expand.svg" alt="Expand" className={className} />
);

export const StarOutlineIcon = ({ className }: { className?: string }) => (
  <Icon src="/svgs/starOutline.svg" alt="Star Outline" className={className} />
);
