import React from 'react';
import NextLink from 'next/link';

type Props = {
  // custom props
  locale?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({ href, target, children, ...rest }: Props) => {
  const isExternal = href ? /^((https?:)?\/\/|[0-9a-zA-Z]+:)/.test(href) : false;
  const isLocalHashLink = href ? /^#/.test(href) : false;

  const main = (
    <a
      href={href}
      target={target}
      {...(isExternal &&
        !isLocalHashLink &&
        target !== '_self' && { href, rel: 'noopener noreferrer', target: '_blank' })}
      {...(isLocalHashLink && { href })}
      {...rest}
    >
      {children}
    </a>
  );

  if (href && (target === '_self' || !target)) {
    return <NextLink href={href} legacyBehavior>{main}</NextLink>;
  }

  return main;
};
