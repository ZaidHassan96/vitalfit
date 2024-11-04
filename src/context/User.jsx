import { createContext, useContext, useEffect, useState } from "react";
import { handleLogin } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { gapi } from "gapi-script";
import { signOut } from "firebase/auth";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userData = localStorage.getItem("userData");

    if (userId) {
      // Set the logged-in user state
      setLoggedInUser(JSON.parse(userData));
    }
  }, []);

  const logIn = async (email, password, navigateInput) => {
    try {
      const userInfo = await handleLogin(email, password, navigateInput);
      setLoggedInUser(userInfo.userData);
      localStorage.setItem("userData", JSON.stringify(userInfo.userData));
      localStorage.setItem("userId", userInfo.uid); // Store the user's ID
      navigate(navigateInput);
    } catch (error) {
      console.error("login failed", error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth); // Sign out the user from Firebase
      setLoggedInUser(null); // Update the state to reflect that the user is logged out
      localStorage.removeItem("userData");
      localStorage.removeItem("userId"); // Store the user's ID
      navigate("/");
      const auth2 = gapi.auth2.getAuthInstance();
      if (auth2) {
        await auth.signOut();
        await auth2.disconnect();
      }
    } catch (error) {
      console.error("Error logging out:", error); // Handle any errors that occur during sign out
    }
  };

  const value = {
    loggedInUser,
    logIn,
    logOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
