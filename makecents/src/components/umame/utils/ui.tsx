/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState } from "react";

const defaultValues = {
  isMenuOpen: false,
  isWaitlistOpen: false,
  toggleWaitlist: (open?: boolean | undefined) => {},
  isNewslistOpen: false,
  toggleNewslist: (open?: boolean | undefined) => {},

  toggleMenu: (open?: boolean | undefined) => {},
  setCountry: (code: string) => {},
  countryCode: "",
  isCountryAvailable: false,
  setCountryAvailable: (available: boolean) => {},
  initPage: false,
  setInitApp: (init: boolean) => {},
};
export const UIContext = React.createContext(defaultValues);

type ProviderProps = {
  children: React.ReactNode;
};

export const UIProvider = ({ children }: ProviderProps) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isWaitlistOpen, setWaitlistOpen] = useState(false);
  const [isNewslistOpen, setNewslistOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [isCountryAvailable, setCountryAvailableStatus] = useState(false);
  const [initPage, setInitPage] = useState(false);

  const preventScroll = (prevent: boolean) => {
    const htmlClassName = "scroll-disabled";

    prevent
      ? document.documentElement.classList.add(htmlClassName)
      : document.documentElement.classList.remove(htmlClassName);
  };

  const toggleMenu = (open?: boolean) => {
    preventScroll(!!open);
    setMenuOpen(!isMenuOpen);
  };

  const toggleWaitlist = (open?: boolean) => {
    // preventScroll(open);
    setWaitlistOpen(!isWaitlistOpen);
  };

  const toggleNewslist = (open?: boolean) => {
    // preventScroll(open);
    setNewslistOpen(!isNewslistOpen);
  };

  const setCountry = (code: string) => {
    setCountryCode(code);
  };

  const setCountryAvailable = (available: boolean) => {
    setCountryAvailableStatus(available);
  };

  const setInitApp = (init: boolean) => {
    setInitPage(init);
  };

  return (
    <UIContext.Provider
      value={{
        ...defaultValues,
        isMenuOpen,
        toggleMenu,
        isWaitlistOpen,
        toggleWaitlist,
        setCountry,
        countryCode,
        isCountryAvailable,
        setCountryAvailable,
        initPage,
        setInitApp,
        isNewslistOpen,
        toggleNewslist,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => React.useContext(UIContext);
