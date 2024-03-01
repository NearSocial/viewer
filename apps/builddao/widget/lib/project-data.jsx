// Get id from the file as a parameter
// process the data and return project object with all the data needed

const { extractValidNearAddresses } = VM.require(
  "buildbox.near/widget/utils.projects-sdk"
) || {
  extractValidNearAddresses: () => {},
};

const extractNearAddress = (id) => {
  const parts = id.split("/");
  if (parts.length > 0) {
    return parts[0];
  }
  return "";
};

const getProjectMeta = (id) => {
  if (!id) {
    throw new Error("Invalid project ID");
  }

  const accountId = extractNearAddress(id);

  const data = Social.get(id + "/**", "final");

  if (!data) {
    throw new Error("Failed to fetch project data");
  }

  try {
    const profile = Social.getr(`${accountId}/profile`, "final");

    const pj = JSON.parse(data[""]);

    console.log("project data ini", pj);

    const validAddresses = pj?.teammates
      ? extractValidNearAddresses(pj.teammates)
      : [];
    const uniqueContributors = [...new Set([accountId, ...validAddresses])];

    const project = {
      title: pj.title,
      description: pj.description,
      tags: pj.tracks,
      projectLink: pj.projectLink,
      demoLink: pj.demoLink,
      contactInfo: pj.contactInfo,
      referrer: pj.referrer,
      learning: pj.learning,
      contributors: uniqueContributors,
      accountId: accountId,
      profile: profile,
    };

    return project;
  } catch (error) {
    console.error("Error parsing project data:", error);
    return null;
  }
};

return { getProjectMeta };
