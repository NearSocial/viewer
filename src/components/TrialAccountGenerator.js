export const TrialAccountGenerator = ({ trigger }) => {
  async function getTrialAccount() {
    try {
      const response = await fetch(
        `https://harmonicdevapim.azure-api.net/bd/KeyPomMain?dropId=1708596356159`,
        { method: "POST" },
      );
      if (!response.ok) {
        // Handle HTTP errors
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const body = await response.json(); // Correctly parse the JSON response body

      // //To-do
      // // Do I really need to get the trial account path like this?
      // // It does help me make localhost work for local testing. Need to change to trial URL in app.js to make it work though.

      //https://www.nearbuilders.org/join?from=trial/#trial-url/ACCOUNT_ID/SECRET_KEY
      const path = body.url.split("https://www.nearbuilders.org")[1];

      //This does not work right now because of keypom selector is implemented.
      //window.location.href = `${window.location.origin}${path}`;

      window.open(`${window.location.origin}${path}`, "_self");
      //window.location.reload();
    } catch (error) {
      console.error("Failed to get trial account:", error);
      throw new Error(error);
    }
  }

  // Attach the getTrialAccount function to the onClick event
  return trigger({ getTrialAccount: getTrialAccount });
};

// Future TO-DO
//1. Log on-chain errors (500) on the console for better debugging.
//2. Log 429, too many requests.
