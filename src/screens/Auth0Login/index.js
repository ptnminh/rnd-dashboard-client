import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const Auth0LoginScreen = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    // Trigger the Auth0 login process when the component mounts
    loginWithRedirect();
  }, [loginWithRedirect]);

  return null; // Render nothing, or you could return a loading spinner
};

export default Auth0LoginScreen;
