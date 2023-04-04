import { LoginMain } from "../components/LoginMain";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!process.env.GOOGLE_OAUTH2_CLIENT_ID || !process.env.BASE_URL) {
    throw new Error(
      "Google OAuth2 Client ID or BASE_URL not set. Configure the environment variables."
    );
  } else {
    return {
      props: {
        googleOAuth2ClientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
        baseUrl: process.env.BASE_URL,
      },
    };
  }
};

interface LoginPageProps {
  googleOAuth2ClientId: string;
  baseUrl: string;
}

export default function LoginPage({
  googleOAuth2ClientId,
  baseUrl,
}: LoginPageProps) {
  return (
    <div>
      <LoginMain
        dataClientId={googleOAuth2ClientId}
        dataLoginUrl={`${baseUrl}/api/login-handler`}
      />
    </div>
  );
}
