/* eslint-disable @typescript-eslint/no-explicit-any */
declare const window: Window &
  typeof globalThis & {
    gtag: any;
  };

function userSignUpConversion(url?: string) {
  const callback = function () {
    if (typeof url !== "undefined") {
      (window as any).location = url;
    }
  };
  window.gtag("event", "conversion", {
    send_to: "AW-11259376934/uKVnCPOEycwYEKbq8fgp",
    event_callback: callback,
  });
  return false;
}

export default userSignUpConversion;
