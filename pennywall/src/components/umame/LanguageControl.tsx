/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import classnames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useClickOutside } from './utils/useClickOutside';

import s from './LanguageControl.module.scss';
import Globe from './assets/globe.svg';

type Props = {
  onLangSelect?: () => void;
  onLangChange?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  direction?: 'up' | 'down';
};

export const LanguageControl = ({
  onLangSelect,
  onLangChange,
  onMouseEnter,
  onMouseLeave,
  direction = 'down',
}: Props) => {
  const locale = 'en'

  const [activeSelector, setActiveSelector] = React.useState(false);
  const ref = React.useRef();

  const langList = {
    en: 'English',
    es: 'Spanish',
    pt: 'Portuguese',
  };

  const move = direction === 'down' ? '-20px' : '20px';

  const sidebarVariants = {
    open: { y: 0, opacity: 1, pointerEvent: 'auto' },
    closed: { y: move, opacity: 0, pointerEvent: 'none' },
  };

  const transition = { duration: 0.4, ease: 'easeInOut' };

  const clickOutside = () => {
    if (activeSelector) {
      setActiveSelector(false);
    }
  };

  const onToggle = () => {
    setActiveSelector(!activeSelector);
    onLangSelect && onLangSelect();
  };

  const onChange = () => {
    setActiveSelector(!activeSelector);
    onLangChange && onLangChange();
  };

  useClickOutside(ref, clickOutside);

  return (
    <div className={classnames(s.languageControl, s[direction])} ref={ref as any}>
      <button
        className={s.languageControl__link}
        onClick={onToggle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Globe className={s.languageControl__icon} />
        <span className={s.languageControl__desktop}>{locale?.toUpperCase()}</span>
        <span className={s.languageControl__mobile}>{langList[locale as keyof typeof langList]}</span>
      </button>
      <AnimatePresence>
        {activeSelector && (
          <motion.ul
            className={s.languageControl__list}
            initial={{ y: move, opacity: 0 }}
            animate={activeSelector ? 'open' : 'closed'}
            exit={{ y: move, opacity: 0 }}
            variants={sidebarVariants}
            transition={transition}
          >
            <li className={classnames(s.languageControl__item)}>
              <a href="/" className={s.languageControl__listLink} hrefLang="en" onClick={onChange}>
                English
              </a>
            </li>
            <li className={classnames(s.languageControl__item)}>
              <a
                href="/fr"
                className={s.languageControl__listLink}
                hrefLang="fr"
                onClick={onChange}
              >
                French
              </a>
            </li>
            <li className={classnames(s.languageControl__item)}>
              <a
                href="/de"
                className={s.languageControl__listLink}
                hrefLang="de"
                onClick={onChange}
              >
                German
              </a>
            </li>
            <li className={classnames(s.languageControl__item)}>
              <a
                href="/es"
                className={s.languageControl__listLink}
                hrefLang="es"
                onClick={onChange}
              >
                Spanish
              </a>
            </li>
            <li className={classnames(s.languageControl__item)}>
              <a
                href="/pt"
                className={s.languageControl__listLink}
                hrefLang="pt"
                onClick={onChange}
              >
                Portuguese
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
