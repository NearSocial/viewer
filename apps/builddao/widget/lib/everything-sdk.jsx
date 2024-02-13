function flattenObject(data, app, type) {
  let paths = [];

  Object.entries(data).forEach(([accountName, accountData]) => {
    if (accountData.hasOwnProperty(app)) {
      const testData = accountData[app];
      if (testData.hasOwnProperty(type)) {
        const thingData = testData[type];
        Object.entries(thingData).forEach(([key]) => {
          paths.push(`${accountName}/${app}/${type}/${key}`);
        });
      }
    }
  });

  return paths;
}

function fetchThings(app, type) {
  const rawKeys = Social.keys(`*/${app}/${type}/*`, "final", {
    return_type: "BlockHeight",
  });

  if (!rawKeys) {
    return "";
  }

  const flattenedKeys = flattenObject(rawKeys, app, type);

  let things = [];
  flattenedKeys.forEach((key) =>
    things.push(JSON.parse(Social.get(key, "final")))
  );

  return things;
}

return { fetchThings };
