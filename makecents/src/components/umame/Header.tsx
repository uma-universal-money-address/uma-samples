/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import classnames from "classnames";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import React from "react";
import { useUI } from "./utils/ui";
import { useEvent } from "./utils/useEvent";
import { usePathname } from "next/navigation";

import Hamburger from './assets/hamburger.svg';
import { LogoIcon } from "../Icons";
import { Link } from "./components/Link";

import checkmark from "./assets/checkmark.json";
import blink from "./assets/code.json";
import notification from "./assets/notification.json";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import s from "./Header.module.scss";
import { ILayout, ILink } from "./types/types";

type Props = {
  layout?: ILayout;
  ctaLinkText?: string | null;
  ctaLink?: ILink | null;
  isDark?: boolean;
  darkHeader?: boolean;
  theme?: string; // 'light' | 'dark' | 'gray';
};

export const Header = ({ layout, isDark, theme = "light" }: Props) => {
  const pathName = usePathname();
  const [isStickyHeader, setStickyHeader] = React.useState(false);
  const [activeNavItem, setActiveNavItem] = React.useState(-1);
  const { toggleWaitlist, toggleMenu, isCountryAvailable, initPage } = useUI();

  const notificationRef = React.useRef() as any;
  const buildRef = React.useRef() as any;
  const getumaRef = React.useRef() as any;

  const onScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    if (!id) return;

    if (id === "modal") {
      e.preventDefault();
      toggleWaitlist(true);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const onMouseEnter = (
    index: React.SetStateAction<number>,
    icon: string | null
  ) => {
    setActiveNavItem(index);
    if (icon === "blink") {
      if (buildRef.current) {
        buildRef.current.play();
      }
    }
    if (icon === "notification") {
      if (notificationRef.current) {
        notificationRef.current.play();
      }
    }

    if (icon === "getuma") {
      if (getumaRef.current) {
        getumaRef.current.stop();
        setTimeout(() => {
          getumaRef.current.play();
        }, 200);
      }
    }
  };

  const onMouseLeave = () => {
    setActiveNavItem(-1);
    if (notificationRef.current) {
      notificationRef.current.stop();
    }
    if (buildRef.current) {
      buildRef.current.stop();
    }
  };

  useEvent("scroll", () => {
    const { pageYOffset } = window;

    // get height of page
    const pageHeight = document.documentElement.scrollHeight;
    setStickyHeader(pageYOffset > 80 && pageYOffset < pageHeight - 2600);
  });

  const sidebarVariants = {
    open: { y: 0 },
    closed: { y: "140%" },
  };

  const transition = { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.9] };

  // custom icons
  const icons = {
    ["blink"]: (
      <Lottie
        animationData={blink}
        loop={true}
        autoPlay={false}
        lottieRef={buildRef}
      />
    ),
    ["notification"]: (
      <Lottie
        animationData={notification}
        loop={false}
        autoPlay={false}
        lottieRef={notificationRef}
      />
    ),
    ["getuma"]: (
      <Lottie
        animationData={checkmark}
        loop={false}
        autoPlay={false}
        lottieRef={getumaRef}
      />
    ),
  };

  return (
    <div key="header">
      <motion.div
        key="header"
        initial={!initPage && { opacity: 0 }}
        animate={!initPage && { opacity: 1 }}
        transition={{ duration: 1 }}
        className={classnames(s.header, s[theme], {
          [s.isDark]: isDark,
          [s.sticky]: isStickyHeader,
        })}
      >
        <div className={s.header__container}>
          <Link className={s.header__logo} href="/" title="UMA">
            {/* <Logo className={s.header__svg} /> */}
            <LogoIcon className={s.header__svg} />
          </Link>
          {layout?.navigation?.length !== 0 && (
            <nav className={s.header__navigation}>
              <LayoutGroup>
                <ul className={s.header__navlist}>
                  {/* Comment out LanguageControl until we support i11n. */}
                  {/* <li
                    key={0}
                    className={classnames(
                      s.header__navitem,
                      s.header__navitemCompact
                    )}
                  >
                    <LanguageControl
                      onLangSelect={() => setActiveNavItem(-1)}
                      onMouseEnter={() => onMouseEnter(0, 'null')}
                      onMouseLeave={onMouseLeave}
                    />
                    <AnimatePresence mode="wait" initial={false}>
                      {activeNavItem === 0 && (
                        <motion.div
                          className={s.header__pill}
                          layoutId="pill"
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </li> */}
                  {layout?.navigation?.map((item, index) => {
                    if (isCountryAvailable && item.ifLocked) {
                      return null;
                    }

                    if (!isCountryAvailable && item.ifOpen) {
                      return null;
                    }

                    return (
                      <li
                        key={item.lottieIcon}
                        className={s.header__navitem}
                        onMouseEnter={() =>
                          onMouseEnter(index + 1, item.lottieIcon)
                        }
                        onMouseLeave={onMouseLeave}
                      >
                        <Link
                          href={
                            item?.anchorId
                              ? `${item?.link?.href}#${item?.anchorId}`
                              : item?.link?.href
                          }
                          className={classnames(s.header__link, {
                            [s.active]:
                              pathName === item.link?.href && !!item.anchorId,
                          })}
                          onClick={(e) => onScrollTo(e, item?.anchorId || "")}
                        >
                          <motion.span>
                            {!!item.lottieIcon && (
                              <div className={s.header__icon}>
                                {icons[item.lottieIcon as keyof typeof icons]}
                              </div>
                            )}
                          </motion.span>
                          <motion.span>{item.title}</motion.span>
                        </Link>
                        <AnimatePresence mode="wait" initial={false}>
                          {activeNavItem === index + 1 && (
                            <motion.div
                              className={s.header__pill}
                              layoutId="pill"
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </LayoutGroup>
            </nav>
          )}

          <button
            className={s.header__hamburger}
            onClick={() => toggleMenu(true)}
            aria-label="Toggle navigation"
          >
            <Hamburger />
          </button>
        </div>
      </motion.div>
      <motion.div
        className={classnames(s.header__sticky, {
          [s.active]: isStickyHeader,
        })}
        initial={{ y: "140%" }}
        animate={isStickyHeader ? "open" : "closed"}
        exit={{ y: "140%" }}
        variants={sidebarVariants}
        transition={transition}
      >
        <ul className={s.header__stickyNav}>
          {layout?.navigation?.map((item, index) => {
            if (isCountryAvailable && item.ifLocked) {
              return null;
            }

            if (!isCountryAvailable && item.ifOpen) {
              return null;
            }

            return (
              <li key={index} className={s.header__stickyItem}>
                <Link
                  href={`${item?.link?.href}${
                    item?.anchorId ? `#${item?.anchorId}` : ""
                  }`}
                  className={classnames(s.header__stickyLink, {
                    [s.active]:
                      pathName === item.link?.href &&
                      !!item.anchorId,
                  })}
                  onClick={(e) => onScrollTo(e, item?.anchorId || "")}
                >
                  <div className={s.header__stickyWrap}>
                    <motion.div
                      className={s.header__stickyTitle}
                      whileHover={{
                        y: "-100%",
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div>{item.title}</div>
                      <div className={s.header__stickyShadow}>{item.title}</div>
                    </motion.div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
};
