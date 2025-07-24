// 'use client';

// // Retrieves a value from local storage and parses it as JSON.
// export function getLocalStorage(key, defaultValue) {
//   const stickyValue = localStorage.getItem(key);

//   if (stickyValue !== null && stickyValue !== undefined) {
//     try {
//       return JSON.parse(stickyValue);
//     } catch (error) {
//       console.error(`Error parsing JSON for key "${key}":`, error);
//       return defaultValue;
//     }
//   } else {
//     return defaultValue;
//   }
// }

// // Stores a value in local storage after serializing it to JSON.
// export function setLocalStorage(key, value) {
//   localStorage.setItem(key, JSON.stringify(value));
// }
