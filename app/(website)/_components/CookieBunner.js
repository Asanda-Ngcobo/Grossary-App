// "use client";

// import { setLocalStorage, getLocalStorage } from "@/app/_lib/helpers/localstoragehelper";
// import { useState, useEffect } from "react";


// export default function CookieBanner() {
//   const [cookieConsent, setCookieConsent] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedCookieConsent = getLocalStorage("cookie_consent", null);
//     console.log("Cookie Consent retrieved from storage: ", storedCookieConsent);
//     setCookieConsent(storedCookieConsent);
//     setIsLoading(false);
//   }, []);

//   useEffect(() => {
//     if (cookieConsent !== null) {
//       setLocalStorage("cookie_consent", cookieConsent);
//     }

//     const newValue = cookieConsent ? "granted" : "denied";

//     if (typeof window !== "undefined" && window.gtag) {
//       window.gtag("consent", "update", {
//         analytics_storage: newValue,
//       });
//     }
//   }, [cookieConsent]);

//   if (isLoading || cookieConsent !== null) {
//     return null;
//   }

//   return (
//     <div className="fixed bottom-4 left-4 right-4 sm:left-8 sm:right-8 bg-white border border-gray-200 shadow-lg rounded-xl z-50 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//       <p className="text-sm sm:text-base text-gray-700">
//         This site uses cookies to improve your experience.
//       </p>
//       <div className="flex gap-3">
//         <button
//           onClick={() => setCookieConsent(false)}
//           className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//         >
//           Decline
//         </button>
//         <button
//           onClick={() => setCookieConsent(true)}
//           className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//         >
//           Accept
//         </button>
//       </div>
//     </div>
//   );
// }
