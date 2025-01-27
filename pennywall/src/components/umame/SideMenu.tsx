// import { LanguageControl } from 'components/language-control/LanguageControl';
import { Link } from "./components/Link";
import { AnimatePresence, motion } from "framer-motion";
import { ILink } from "./types/types";
import { ILayout } from "./types/types";
import React from "react";
import { useUI } from "./utils/ui";

import { Button } from "./components/Button";

import s from "./SideMenu.module.scss";
import { CloseIcon, LogoIcon } from "../Icons";

type Props = {
  layout?: ILayout | null;
  children?: React.ReactNode;
  ctaLinkText?: React.ReactNode;
  ctaLink?: ILink | null;
};

export const SideMenu = ({ layout }: Props) => {
  const { toggleMenu, isMenuOpen, toggleWaitlist, isCountryAvailable } =
    useUI();

  const onClick = (e: { preventDefault: () => void }, id: string) => {
    toggleMenu(false);

    if (id === "modal") {
      e.preventDefault();
      toggleWaitlist(true);
    } else {
      const el = document.getElementById(id);
      if (el) {
        // router.asPath == item.link?.href
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "110%" },
  };

  const transition = { duration: 0.7, ease: [0.6, 0.01, -0.05, 0.9] };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className={s.sideMenu}
          initial={{ x: "110%" }}
          animate={isMenuOpen ? "open" : "closed"}
          exit={{ x: "110%" }}
          variants={sidebarVariants}
          transition={transition}
        >
          <div className={s.sideMenu__header}>
            <div className={s.sideMenu__logo}>
              <Link href="/" title="UMA" onClick={() => toggleMenu(false)}>
                {/* <Logo /> */}
                <LogoIcon />
              </Link>
            </div>
            <button
              className={s.sideMenu__close}
              onClick={() => toggleMenu(false)}
            >
              {/* <Cross /> */}
              <CloseIcon />
            </button>
          </div>
          <div className={s.sideMenu__inner}>
            <div className={s.sideMenu__container}>
              <h2 className={s.sideMenu__heading}>
                Explore building on the UMA open source standard.
              </h2>
            </div>
            <div className={s.sideMenu__cta}>
              {/* <LanguageControl direction="up" onLangChange={() => toggleMenu(false)} /> */}
              {layout?.navigation?.map((item, index) => {
                if (isCountryAvailable && item.ifLocked) {
                  return null;
                }

                if (!isCountryAvailable && item.ifOpen) {
                  return null;
                }
                return (
                  <div className={s.sideMenu__item} key={`sidecta-${index}`}>
                    <Button
                      href={
                        item?.anchorId
                          ? `${item?.link?.href}#${item?.anchorId}`
                          : item?.link?.href
                      }
                      appearance="primary"
                      onClick={(e: { preventDefault: () => void }) =>
                        onClick(e, item?.anchorId || "")
                      }
                      size="large"
                      block
                    >
                      {item.title}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
