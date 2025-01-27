/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
"use client";

import React from 'react';

import { Button } from './components/Button';
import { Link } from './components/Link';
import _debounce from 'lodash/debounce';

import s from './Footer.module.scss';
import { ILayout, ILink } from './types/types';
import { LogoDarkIcon, LogoIcon } from '../Icons';

type Props = {
  navigation?: { title?: string; link?: ILink }[];
  layout?: ILayout | null;
  title?: string | null;
  legal?: { title?: string; link?: ILink }[];
  social?: { title?: string; link?: ILink }[];
  copyright?: React.ReactNode;
  invertedFooter?: boolean | null;
  ctaText?: string | null;
  ctaLink?: ILink | null;
};

declare global {
  var Osano: any;
}

export const Footer = ({ navigation, title, legal, ctaLink, ctaText }: Props) => {
  const refFooter = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  const refText = React.useRef(null);

  const showCookieManager = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (typeof Osano !== 'undefined') {
      Osano.cm.showDrawer('osano-cm-dom-info-dialog-open');
    }
  };

  // const { scrollYProgress } = useScroll();

  // const { scrollY } = useViewportScroll();
  // // const opacityRange = [1, 0];
  // // const opacity = useTransform(scrollY, scrollRange, opacityRange);

  // const scaleX = useSpring(scrollYProgress, {
  //   stiffness: 100,
  //   damping: 30,
  //   restDelta: 0.001,
  // });

  const onResize = _debounce(() => {
    if (typeof window === undefined) {
      return;
    }

    // get footer height by refFooter
    const footerHeight = refFooter?.current?.clientHeight || 0;
    document.documentElement.style.setProperty('--footerheight', `${footerHeight}px`);
  }, 100);

  React.useEffect(() => {
    if (typeof window === undefined) {
      return;
    }

    onResize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.footer} ref={refFooter}>
      <div className={s.footer__mask} />
      <div className={s.footer__wrap}>
        <div className={s.footer__container}>
          <div className={s.footer__navigation}>
            <div>
              <Link className={s.footer__logoMobile} href="/" title="UMA">
                {/* <LogoDark className={s.footer__svg} /> */}
                <LogoIcon />
              </Link>
              <div className={s.footer__headingWrap}>
                <h3 className={s.footer__heading}>{title}</h3>
                {/* <h4 className={s.footer__headingBase}>
                  <motion.span>Start</motion.span>
                  <span>building</span> <span>on</span> <span>the</span> <span>UMA</span>{' '}
                  <span>open</span> <span>source</span> <span>standard.</span>
                </h4> */}
              </div>

              <Button target="_blank" type="submit" size="medium" appearance="blue" {...ctaLink}>
                {ctaText}
              </Button>
            </div>

            <ul className={s.footer__list}>
              {navigation?.map((item, index) => (
                <li key={`item-${index}`} className={s.footer__item}>
                  <Link {...item?.link} className={s.footer__link}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* <motion.div className={s.footer__progress} style={{ scaleX }} /> */}
          <div className={s.footer__bottom}>
            <Link className={s.footer__logo} href="/" title="UMA">
              {/* <LogoDark className={s.footer__svg} /> */}
              <LogoIcon className={s.footer__svg} />
            </Link>
            <div className={s.footer__legal}>
              <div className={s.footer__legalWrap}>
                © UMA {new Date().getFullYear()}
                {legal?.map((item, index) => (
                  <Link href={item?.link?.href} key={index} className={s.footer__legalLink}>
                    {item.title}
                  </Link>
                ))}
                {/* <Link
                  href="#"
                  className={s.footer__legalLink}
                  onClick={(e) => showCookieManager(e)}
                >
                  Cookie Preferences
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
