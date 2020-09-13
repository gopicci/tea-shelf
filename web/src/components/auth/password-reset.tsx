import React, { ReactElement, useState } from "react";
import AuthLayout from "./auth-layout";
import PasswordResetForm from "./password-reset-form";
import { Route } from "../../app";

/**
 * PasswordReset props.
 *
 * @memberOf PasswordReset
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Password reset token */
  token: string;
};

/**
 * Password reset component
 *
 * @component
 * @subcategory Auth
 */
function PasswordReset({ setRoute, token }: Props): ReactElement {
  const [reset, setReset] = useState(false);

  return (
    <AuthLayout title={reset ? "Password updated" : "Update password"}>
      <PasswordResetForm
        setRoute={setRoute}
        token={token}
        reset={reset}
        setReset={setReset}
        endpoint="/password_reset/confirm/"
      />
    </AuthLayout>
  );
}

export default PasswordReset;
