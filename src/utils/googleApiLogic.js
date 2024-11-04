import { gapi } from "gapi-script";

// HANDLE GOOGLE LOGIN
export async function handleGoogleLogin() {
  const authInstance = gapi.auth2.getAuthInstance();
  if (authInstance.isSignedIn.get()) {
    return authInstance.currentUser.get();
  } else {
    try {
      await authInstance.signIn();
      if (authInstance.isSignedIn.get()) {
        return authInstance.currentUser.get();
      }
    } catch (error) {
      console.error("Error signing in", error);
      throw error;
    }
  }
}

async function checkGrantedScopes(currentUser) {
  const scopes = currentUser.getGrantedScopes();
  if (
    !scopes ||
    !scopes.includes("https://www.googleapis.com/auth/calendar.events")
  ) {
    console.warn(
      "User did not grant calendar permissions, prompting for consent."
    );
    return false;
  }
  return true;
}

export async function getAccessToken(currentUser) {
  let accessToken = currentUser.getAuthResponse().access_token;

  // If the current scope does not include 'https://www.googleapis.com/auth/calendar.events'
  if (!accessToken) {
    try {
      // Attempt to sign in silently to get a new token
      await authInstance.signIn({ prompt: "none" });
      accessToken = authInstance.currentUser
        .get()
        .getAuthResponse().access_token;
    } catch (error) {
      console.error(
        "User canceled or failed to re-authenticate for additional permissions.",
        error
      );
      throw error;
    }
  }
  // Check if the user has the necessary permissions by inspecting the granted scopes
  const scopesGranted = await checkGrantedScopes(currentUser);
  if (!scopesGranted) {
    console.warn(
      "User has not granted all necessary permissions. Please prompt for consent."
    );
    try {
      // If permissions are not granted, prompt for consent
      await authInstance.signIn({ prompt: "consent" });
      accessToken = authInstance.currentUser
        .get()
        .getAuthResponse().access_token; // Try to get the access token again
    } catch (error) {
      console.error(
        "User canceled or failed to re-authenticate for additional permissions.",
        error
      );
      throw error; // Rethrow the error to be handled elsewhere
    }
  }

  return accessToken;
}

function dateTimeFormat(singleClassData) {
  if (!singleClassData) {
    return;
  } else {
    const classDate = singleClassData.date; // e.g., "Sun, Oct 27"
    const classTime = singleClassData.startTime; // e.g., "17:50"

    const today = new Date();
    const year = today.getFullYear(); // Use the current year

    // Format the date as "Month Day" (e.g., "Oct 27") and combine it with the current year
    const dateParts = classDate ? classDate.split(",")[1].trim() : true; // Get "Oct 27"
    const fullDateString = `${dateParts} ${year}`; // Combine with the year (e.g., "Oct 27 2024")

    // Create a new date string by combining the full date and time
    const startTimeString = `${fullDateString} ${classTime}`; // e.g., "Oct 27 2024 17:50"

    // Create a valid Date object
    const startTime = new Date(startTimeString);
    if (isNaN(startTime.getTime())) {
      console.error("Invalid date format for startTime:", startTimeString);
      alert("The class date or time is invalid.");
      return;
    }
    return startTime;
  }
}

export async function createEvent(singleClassData, accessToken) {
  const startTime = dateTimeFormat(singleClassData); // Format the start time based on class data

  // Event details
  const eventDetails = {
    summary: `${singleClassData.classType} Class`,
    description: `You have successfully booked a ${singleClassData.classType} class.`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: new Date(startTime.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      timeZone: "America/Los_Angeles",
    },
  };

  // Set token for the API request
  gapi.client.setToken({ access_token: accessToken });

  try {
    // Make the request to create the event
    await gapi.client.request({
      path: `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      method: "POST",
      body: eventDetails,
    });

    // Perform success actions

    // alert("Class booked and added to your Google Calendar!");
  } catch (error) {
    console.error("Error creating event in Google Calendar:", error);
    throw error;
  }
}
