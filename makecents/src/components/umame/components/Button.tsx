/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import classnames from 'classnames';
import { ILink } from '../types/types';

import { Link } from './Link';

import s from './Button.module.scss';

type Props = {
  children?: React.ReactNode;
  link?: ILink | null;
  disabled?: boolean;
  appearance?:
    | 'primary'
    | 'secondary'
    | 'secondary-dark'
    | 'outline'
    | 'outline-dark'
    | 'text'
    | 'primary-dark'
    | 'primary-fill-dark'
    | 'highlight'
    | 'highlight-dark'
    | 'blue'
    | 'blue-dark'
    | 'inverted';
  size?: 'small' | 'medium' | 'large';
  width?: 'fill' | string;
  arrow?: boolean;
  block?: boolean;
  loading?: boolean;

  [rest: string]: any;
};

export const Button = ({
  children,
  link,
  disabled = false,
  appearance = 'primary',
  size = 'medium',
  width,
  // icon,
  block,
  loading,
  arrow,
  ...rest
}: Props) => {
  const Tag = rest.href || link ? Link : 'button';

  return (
    <Tag
      className={classnames(s.button, s[appearance], s[size], {
        [s.disabled]: disabled,
        [s.arrow]: !!arrow,
        [s.block]: !!block,
        [s.fill]: width === 'fill',
        [s.loading]: loading,
      })}
      disabled={disabled}
      {...link}
      {...rest}
    >
      <span className={s.button__label}>
        {loading && (
          <div className={s.button__loading}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}

        <span className={s.button__text}>{children}</span>
      </span>
    </Tag>
  );
};
