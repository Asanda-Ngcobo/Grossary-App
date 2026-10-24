export class PlusError extends Error {
  constructor(code, { status, serverMessage } = {}) {
    super(code);
    this.code = code;
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

export const ERROR_COPY = {
  // Location
  GEO_DENIED: {
    title: "Location access is blocked",
    body: "We need your location to find nearby stores. Tap the lock icon next to the address bar, allow Location, then try again.",
    retry: true,
  },
  GEO_UNAVAILABLE: {
    title: "We couldn't detect your location",
    body: "Check that location services are turned on and try again.",
    retry: true,
  },
  GEO_TIMEOUT: {
    title: "Location request timed out",
    body: "Finding your location took too long. Check your connection and try again.",
    retry: true,
  },
  GEO_UNSUPPORTED: {
    title: "Location isn't supported",
    body: "Your browser doesn't support location. Try a different browser.",
    support: true,
  },

  // Network / transport
  OFFLINE: {
    title: "You're offline",
    body: "Check your internet connection and try again.",
    retry: true,
  },
  NETWORK_ERROR: {
    title: "Connection problem",
    body: "We couldn't reach Grossary. Check your connection and try again.",
    retry: true,
  },
  REQUEST_TIMEOUT: {
    title: "This is taking too long",
    body: "Building your plan timed out. Please try again.",
    retry: true,
    support: true,
  },
  BAD_RESPONSE: {
    title: "Something went wrong on our side",
    body: "We got an unexpected response from the server. Please try again.",
    retry: true,
    support: true,
  },

  // API codes from your routes
  UNAUTHORIZED: {
    title: "Please log in",
    body: "Your session has expired. Log in again to continue.",
  },
  STATUS_CHECK_FAILED: {
    title: "We couldn't verify your subscription",
    body: "Please try again in a moment.",
    retry: true,
    support: true,
  },
  PROFILE_NOT_FOUND: {
    title: "We couldn't verify your subscription",
    body: "Please try again in a moment.",
    retry: true,
    support: true,
  },
  EMPTY_LIST: {
    title: "Your list is empty",
    body: "Add some items to this list first.",
  },
  LIST_NOT_FOUND: {
    title: "List not found",
    body: "We couldn't find that grocery list.",
    support: true,
  },
  INVALID_LOCATION: {
    title: "Invalid location",
    body: "We got an unusable location from your device. Please try again.",
    retry: true,
  },
  NO_SHARED_LOCATION: {
    title: "No stores found near you",
    body: "We couldn't find a shopping location with both Checkers and Pick n Pay close to you.",
  },
  INVALID_SHARED_LOCATION: {
    title: "Store data is incomplete",
    body: "The nearest shopping location is missing retailer information.",
    support: true,
  },
  ITEMS_LOAD_FAILED: {
    title: "We couldn't load your list items",
    body: "Please try again.",
    retry: true,
    support: true,
  },
  OPTIMIZATION_FAILED: {
    title: "We couldn't build your plan",
    body: "Something went wrong while comparing prices. Please try again.",
    retry: true,
    support: true,
  },
  GROSSARY_PLUS_ERROR: {
    title: "We couldn't create your shopping plan.",
    body: "Please try again. If the issue persists, please:",
    retry: true,
    support: true,
  },
};

export const DEFAULT_COPY = {
  title: "We couldn't create your shopping plan.",
  body: "Please refresh the page & try again. If the issue persists, please:",
  retry: true,
  support: true,
};

export function toPlusErrorCode(error) {
  if (error instanceof PlusError) return error.code;

  // Geolocation errors are not Error instances
  if (
    typeof GeolocationPositionError !== "undefined" &&
    error instanceof GeolocationPositionError
  ) {
    return ["GEO_UNKNOWN", "GEO_DENIED", "GEO_UNAVAILABLE", "GEO_TIMEOUT"][error.code] || "GEO_UNAVAILABLE";
  }

  if (error?.name === "AbortError") return "REQUEST_TIMEOUT";

  // fetch() rejects with TypeError when the network fails
  if (error instanceof TypeError) return "NETWORK_ERROR";

  return "UNKNOWN";
}