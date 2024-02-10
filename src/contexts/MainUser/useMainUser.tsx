import {type User} from "firebase/auth";
import {useContext} from "react";
import {MainUserContext} from "./MainUserContext";
import {type MainUserContextProps} from "./types";

export const useMainUser = (): MainUserContextProps & {
  user: User;
} => {
  const context = useContext(MainUserContext);
  if (context === undefined) {
    throw new Error("useMainUser must be used within a MainUserProvider");
  }
  if (context.user == null) {
    throw new Error("No user found.");
  }

  return {...context, user: context.user};
};

export const useMainUserRaw = (): MainUserContextProps => {
  const context = useContext(MainUserContext);
  if (context === undefined) {
    throw new Error("useMainUser must be used within a MainUserProvider");
  }
  return context;
};
