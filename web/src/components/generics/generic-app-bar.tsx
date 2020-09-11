import React, { ReactElement } from "react";
import { AppBar, useScrollTrigger } from "@material-ui/core";

/**
 * GenericAppBar props.
 *
 * @memberOf GenericAppBar
 */
type Props = {
  /** Children components */
  children: ReactElement;
};

/**
 * Custom fixed app bar with top page shadow trigger.
 *
 * @component
 * @subcategory Generics
 */
function GenericAppBar({ children }: Props): ReactElement {
  const shadowTrigger = useScrollTrigger({
    threshold: 1,
    disableHysteresis: true,
  });

  return (
    <AppBar
      position="fixed"
      elevation={shadowTrigger ? 3 : 0}
      style={{ border: 0 }}
    >
      {children}
    </AppBar>
  );
}

export default GenericAppBar;
