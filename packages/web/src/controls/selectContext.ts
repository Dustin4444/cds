import { createContext, useContext } from 'react';

import type { SelectBaseProps } from './Select';

/** @deprecated Please use the new Select alpha component instead. */
export type SelectContextType = {
  handleCloseMenu?: () => void;
} & Pick<SelectBaseProps, 'onChange' | 'value'>;

export const defaultContext = {
  onChange: () => {},
  value: undefined,
  handleCloseMenu: undefined,
};

/** @deprecated Please use the new Select alpha component instead. */
export const SelectContext = createContext<SelectContextType>(defaultContext);

/** @deprecated Please use the new Select alpha component instead. */
export const SelectProvider = SelectContext.Provider;

/** @deprecated Please use the new Select alpha component instead. */
export const useSelectContext = () => useContext(SelectContext);
