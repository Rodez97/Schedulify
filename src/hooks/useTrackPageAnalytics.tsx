import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {logEvent} from "firebase/analytics";
import {ANALYTICS} from "../firebase";

function useTrackPageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = location.pathname + location.search;
    logEvent(ANALYTICS, "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);
}

export default useTrackPageAnalytics;
