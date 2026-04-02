import { css } from '@linaria/core';

import { cx } from '../cx';
import { Text, type TextProps } from '../typography/Text';

import type { PaginationEllipsisProps } from './Pagination';

const contentBoxCss = css`
  box-sizing: content-box;
`;

export type DefaultPaginationEllipsisProps = PaginationEllipsisProps &
  Omit<TextProps<'span'>, 'children'>;

export const DefaultPaginationEllipsis = ({
  content = '...',
  className,
  ...props
}: DefaultPaginationEllipsisProps) => (
  <Text
    noWrap
    aria-hidden="true"
    className={cx(contentBoxCss, className)}
    font="headline"
    minWidth={20}
    paddingX={2}
    {...props}
  >
    {content}
  </Text>
);
