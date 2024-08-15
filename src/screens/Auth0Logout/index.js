import { useAuth0 } from "@auth0/auth0-react";

const Auth0Logout = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
};

export default Auth0Logout;
