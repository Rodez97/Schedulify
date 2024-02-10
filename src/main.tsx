import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import "./firebase.ts";
import {MainUserProvider} from "./contexts/MainUser/MainUserProvider.tsx";
import TagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "G-5H8C8VYPPL",
};

TagManager.initialize(tagManagerArgs);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MainUserProvider
        onError={error => {
          console.error(error);
        }}>
        <App />
      </MainUserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Listen for resize events on window
const appSize = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  doc.style.setProperty("--app-width", `${window.innerWidth}px`);
};
window.addEventListener("resize", appSize);
appSize();
