function flattenObject(data, app, type) {
  let paths = [];

  Object.entries(data).forEach(([accountName, accountData]) => {
    if (accountData.hasOwnProperty(app)) {
      const testData = accountData[app];
      if (testData.hasOwnProperty(type)) {
        const eventData = testData[type];
        Object.entries(eventData).forEach(([eventKey]) => {
          paths.push(`${accountName}/${app}/${type}/${eventKey}`);
        });
      }
    }
  });

  return paths;
}

function fetchEvents(app, type) {
  const rawKeys = Social.keys(`*/${app}/${type}/*`, "final", {
    return_type: "BlockHeight",
  });

  if (!rawKeys) {
    return "";
  }

  const flattenedKeys = flattenObject(rawKeys, app, type);

  let events = [];
  flattenedKeys.forEach((key) =>
    events.push(JSON.parse(Social.get(key, "final")))
  );

  return events;
}

return { fetchEvents };
