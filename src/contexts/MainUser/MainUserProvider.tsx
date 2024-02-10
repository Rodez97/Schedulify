import {AUTH, FIRESTORE} from "../../firebase";
import {type ReactElement, useState} from "react";
import {
  doc,
  serverTimestamp,
  setDoc,
  type WithFieldValue,
} from "firebase/firestore";
import type Team from "../../types/Team";
import {useIdToken} from "react-firebase-hooks/auth";
import {DEFAULT_SCHEDULE_LIMITS} from "../../utils/constants";
import {MainUserContext} from "./MainUserContext";

export const MainUserProvider = ({
  children,
  onError,
}: {
  children: ReactElement;
  onError: (error: Error) => void;
}) => {
  const [user, loadingUser, errorUser] = useIdToken(AUTH);
  const [creatingFirstSchedule, setCreatingFirstSchedule] = useState(false);

  const createFirstSchedule = async (userId: string) => {
    // Create First Schedule
    const scheduleId = userId;
    const scheduleToSave: WithFieldValue<Team> = {
      id: scheduleId,
      name: "My First Schedule",
      color: "#1890ff",
      createdAt: serverTimestamp(),
      ownerId: userId,
      limits: DEFAULT_SCHEDULE_LIMITS,
    };
    try {
      setCreatingFirstSchedule(true);
      await setDoc(doc(FIRESTORE, "schedules", scheduleId), scheduleToSave);
      return scheduleId;
    } catch (error) {
      console.error(error);
    } finally {
      setCreatingFirstSchedule(false);
    }
  };

  return (
    <MainUserContext.Provider
      value={{
        user,
        onError,
        loading: loadingUser ?? creatingFirstSchedule,
        error: errorUser,
        createFirstSchedule,
      }}>
      {children}
    </MainUserContext.Provider>
  );
};
