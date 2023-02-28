const CATEGORIES = require("../categories.json");

const categorize = (resources) => {
  const categorizedResources = {};
  resources.forEach((resource) => {
    if (typeof resource === "string") {
      [type, name] = resource.split(".");
      resource = { type, name };
    }
    const category = CATEGORIES["resources"][resource.type];
    if (category) {
      if (!categorizedResources[category]) {
        categorizedResources[category] = [];
      }
      categorizedResources[category].push(resource);
    }
  });
  // Sort the resources by type
  Object.keys(categorizedResources).forEach((category) => {
    categorizedResources[category].sort((a, b) => {
      if (a.type < b.type) {
        return -1;
      }
      if (a.type > b.type) {
        return 1;
      }
      return 0;
    });
  });

  // Sort the categories
  const sortedCategories = {};
  Object.keys(categorizedResources)
    .sort()
    .forEach((category) => {
      sortedCategories[category] = categorizedResources[category];
    });

  return sortedCategories;
};

exports.categorize = categorize;
