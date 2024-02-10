import {useReducer, useMemo} from "react";

interface DiscloseAction {
  type: "open" | "close" | "toggle";
}

function discloseReducer(state: boolean, action: DiscloseAction): boolean {
  switch (action.type) {
    case "open":
      return true;
    case "close":
      return false;
    case "toggle":
      return !state;
    default:
      return state;
  }
}

type DiscloseHook = [boolean, () => void, () => void, () => void];

export function useDisclose(initialState = false): DiscloseHook {
  const [isOpen, dispatch] = useReducer(discloseReducer, initialState);

  const open = () => {
    dispatch({type: "open"});
  };

  const close = () => {
    dispatch({type: "close"});
  };

  const toggle = () => {
    dispatch({type: "toggle"});
  };

  const resArray = useMemo<DiscloseHook>(
    () => [isOpen, open, close, toggle],
    [isOpen],
  );

  return resArray;
}
