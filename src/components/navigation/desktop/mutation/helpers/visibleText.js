export const visibleText = (hash) => {
  if (hash && hash.length > 26) {
    const firstCharacters = hash.substring(0, 20);

    return `${firstCharacters}...`;
  } else {
    return hash;
  }
};
