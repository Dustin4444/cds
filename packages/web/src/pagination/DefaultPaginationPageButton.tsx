import { forwardRef, useCallback } from 'react';
import { css } from '@linaria/core';

import { Button } from '../buttons/Button';

import type { PaginationPageButtonProps } from './Pagination';

const pageLabelCss = css`
  min-width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`;

export const DefaultPaginationPageButton = forwardRef(
  (
    {
      page,
      onClick,
      isCurrentPage,
      disabled,
      accessibilityLabel,
      testID,
      ...props
    }: PaginationPageButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const handleClick = useCallback(() => onClick(page), [onClick, page]);

    return (
      <Button
        ref={ref}
        compact
        accessibilityLabel={accessibilityLabel}
        aria-current={isCurrentPage ? 'page' : undefined}
        disabled={disabled}
        font="headline"
        onClick={handleClick}
        testID={testID}
        transparent={!isCurrentPage}
        variant={isCurrentPage ? 'primary' : 'secondary'}
        {...props}
      >
        <span className={pageLabelCss}>{page}</span>
      </Button>
    );
  },
);
