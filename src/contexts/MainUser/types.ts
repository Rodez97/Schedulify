import {type User} from "firebase/auth";

export interface MainUserContextProps {
  user: User | null | undefined;
  onError: (error: Error) => void;
  loading: boolean;
  error: Error | undefined;
  createFirstSchedule: (userId: string) => Promise<string | undefined>;
}
