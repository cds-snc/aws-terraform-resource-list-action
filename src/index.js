const categorize = require("./categorize");
const formatters = require("./formatters");
const lexers = require("./lexers");

const core = require("@actions/core");

const main = () => {
  const dotFilePath = core.getInput("dot-file-path");
  const terraformDirPath = core.getInput("terraform-dir-path");
  const terraformStatePath = core.getInput("terraform-state-path");

  const outPutFormat = core.getInput("output-format");

  let categorizedResources = {};

  if (dotFilePath) {
    const resources = lexers.terraformGraphFile(dotFilePath);
    categorizedResources = categorize.categorize(resources);
  } else if (terraformDirPath) {
    const resources = lexers.terraformDir(terraformDirPath);
    categorizedResources = categorize.categorize(resources);
  } else if (terraformStatePath) {
    const resources = lexers.terraformStateFile(terraformStatePath);
    categorizedResources = categorize.categorize(resources);
  } else {
    core.setFailed("No input provided");
  }

  if (outPutFormat === "markdown") {
    core.setOutput(
      "categorized-resources",
      formatters.markdown(categorizedResources)
    );
  } else {
    core.setOutput(
      "categorized-resources",
      JSON.stringify(categorizedResources)
    );
  }
};

main();

exports.main = main;
