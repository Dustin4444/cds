import { css } from '@linaria/core';

import { Text, type TextProps } from '../typography/Text';

import type { PaginationEllipsisProps } from './Pagination';

const ellipsisLabelCss = css`
  min-width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
`;

export type DefaultPaginationEllipsisProps = PaginationEllipsisProps &
  Omit<TextProps<'span'>, 'children'>;

export const DefaultPaginationEllipsis = ({
  content = '...',
  ...props
}: DefaultPaginationEllipsisProps) => (
  <Text noWrap aria-hidden="true" font="headline" paddingX={2} {...props}>
    <span className={ellipsisLabelCss}>{content}</span>
  </Text>
);
