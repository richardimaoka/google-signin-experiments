export interface LoginMainProps {
  dataClientId: string;
  dataLoginUrl: string;
}

export const LoginMain = ({ dataClientId, dataLoginUrl }: LoginMainProps) => {
  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={dataClientId}
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri={dataLoginUrl}
        data-nonce=""
        data-auto_select="true"
        data-itp_support="true"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </>
  );
};
