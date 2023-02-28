const { main } = require("./index");

const categorize = require("./categorize");
const formatters = require("./formatters");
const lexers = require("./lexers");

const core = require("@actions/core");
const { when } = require("jest-when");

jest.mock("@actions/core");
jest.mock("./categorize");
jest.mock("./formatters");
jest.mock("./lexers");

afterEach(() => {
  jest.clearAllMocks();
});

describe("main", () => {
  test("should fail if no input is provided", () => {
    when(core.getInput).calledWith("dot-file-path").mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue(undefined);

    main();

    expect(core.setFailed).toHaveBeenCalledWith("No input provided");
  });

  test("calls terraformGraphFile if dot-file-path is provided", () => {
    when(core.getInput)
      .calledWith("dot-file-path")
      .mockReturnValue("some/dot-file");

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue(undefined);

    main();

    expect(lexers.terraformGraphFile).toHaveBeenCalledWith("some/dot-file");
    expect(lexers.terraformDir).not.toHaveBeenCalled();
    expect(lexers.terraformStateFile).not.toHaveBeenCalled();
    expect(categorize.categorize).toHaveBeenCalled();
  });

  test("calls terraformDir if terraform-dir-path is provided", () => {
    when(core.getInput).calledWith("dot-file-path").mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue("some/dir-path");

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue(undefined);

    main();

    expect(lexers.terraformGraphFile).not.toHaveBeenCalled();
    expect(lexers.terraformDir).toHaveBeenCalledWith("some/dir-path");
    expect(lexers.terraformStateFile).not.toHaveBeenCalled();
    expect(categorize.categorize).toHaveBeenCalled();
  });

  test("calls terraformStateFile if terraform-state-path is provided", () => {
    when(core.getInput).calledWith("dot-file-path").mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue("some/state-path");

    main();

    expect(lexers.terraformGraphFile).not.toHaveBeenCalled();
    expect(lexers.terraformDir).not.toHaveBeenCalled();
    expect(lexers.terraformStateFile).toHaveBeenCalledWith("some/state-path");
    expect(categorize.categorize).toHaveBeenCalled();
  });

  test("calls formatters.markdown if output-format is markdown", () => {
    when(core.getInput)
      .calledWith("dot-file-path")
      .mockReturnValue("some/dot-file");

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue(undefined);

    when(core.getInput).calledWith("output-format").mockReturnValue("markdown");

    when(lexers.terraformGraphFile)
      .calledWith("some/dot-file")
      .mockReturnValue([]);

    when(categorize.categorize)
      .calledWith(expect.any(Array))
      .mockReturnValue({});

    when(formatters.markdown).calledWith({}).mockReturnValue("some markdown");

    main();

    expect(formatters.markdown).toHaveBeenCalledWith({});
    expect(core.setOutput).toHaveBeenCalledWith(
      "categorized-resources",
      "some markdown"
    );
  });

  test("calls JSON.stringify if output-format is not markdown", () => {
    when(core.getInput)
      .calledWith("dot-file-path")
      .mockReturnValue("some/dot-file");

    when(core.getInput)
      .calledWith("terraform-dir-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("terraform-state-path")
      .mockReturnValue(undefined);

    when(core.getInput)
      .calledWith("output-format")
      .mockReturnValue("not-markdown");

    when(lexers.terraformGraphFile)
      .calledWith("some/dot-file")
      .mockReturnValue([]);

    when(categorize.categorize)
      .calledWith(expect.any(Array))
      .mockReturnValue({});

    when(formatters.markdown).calledWith({}).mockReturnValue("some markdown");

    main();

    expect(core.setOutput).toHaveBeenCalledWith("categorized-resources", "{}");
  });
});
