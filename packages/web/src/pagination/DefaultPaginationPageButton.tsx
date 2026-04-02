import { forwardRef, useCallback } from 'react';
import { css } from '@linaria/core';

import { Button, type ButtonBaseProps } from '../buttons/Button';
import { cx } from '../cx';

import type { PaginationPageButtonProps } from './Pagination';

const contentBoxCss = css`
  box-sizing: content-box;
`;

export type DefaultPaginationPageButtonProps = PaginationPageButtonProps &
  Omit<ButtonBaseProps, keyof PaginationPageButtonProps | 'children' | 'onClick'> & {
    className?: string;
    style?: React.CSSProperties;
  };

export const DefaultPaginationPageButton = forwardRef<
  HTMLButtonElement,
  DefaultPaginationPageButtonProps
>(
  (
    {
      page,
      onClick,
      isCurrentPage,
      disabled,
      accessibilityLabel,
      testID,
      className,
      ...props
    }: DefaultPaginationPageButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const handleClick = useCallback(() => onClick(page), [onClick, page]);

    return (
      <Button
        ref={ref}
        compact
        accessibilityLabel={accessibilityLabel}
        aria-current={isCurrentPage ? 'page' : undefined}
        className={cx(contentBoxCss, className)}
        disabled={disabled}
        font="headline"
        minWidth={20}
        onClick={handleClick}
        testID={testID}
        transparent={!isCurrentPage}
        variant={isCurrentPage ? 'primary' : 'secondary'}
        {...props}
      >
        {page}
      </Button>
    );
  },
);
