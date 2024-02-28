/* HELPER FUNCTION */
function isNearAddress(address) {
  if (typeof address !== "string") {
    return false;
  }

  // Allow both ".near" and ".testnet" endings
  if (!address.endsWith(".near") && !address.endsWith(".testnet")) {
    return false;
  }

  const parts = address.split(".");
  if (parts.length !== 2) {
    return false;
  }

  if (parts[0].length < 2 || parts[0].length > 32) {
    return false;
  }

  if (!/^[a-z0-9_-]+$/i.test(parts[0])) {
    return false;
  }

  return true;
}

const validNearAddresses = (string) => {
  // removing extra characters and splitting the string into an array
  const arr = string.replace(/[\[\]\(\)@]/g, "").split(/[\s,]+/);

  // filtering out teammates that are not near addresses
  const hexRegex = /^[0-9A-F\-_]+$/i;
  const valid = arr.filter((teammate) => {
    if (hexRegex.test(teammate)) {
      return teammate;
    }
    return isNearAddress(teammate);
  });

  console.log("valid from validNearAddresses", valid);

  return valid;
};

return { validNearAddresses };
