import React from 'react';
import classnames from 'classnames';

import s from './Layout.module.scss';

type Props = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  sideMenu?: React.ReactNode;
  theme?: string; // 'light' | 'dark' | 'gray';
  notification?: React.ReactNode;
  overflow?: boolean;
};

export const Layout = ({
  header,
  notification,
  footer,
  children,
  sideMenu,
  theme = 'light',
  overflow = false,
}: Props) => {
  return (
    <>
      {notification}
      <div
        className={classnames(s.layout, s[theme], {
          [s.banner]: !!notification,
          [s.overflow]: !!overflow,
        })}
      >
        {header}
        <main className={s.layout__main}>{children}</main>
        <div className={s.layout__footerspace} />
        {footer}
        {sideMenu}
      </div>
    </>
  );
};
