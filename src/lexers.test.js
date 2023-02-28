const {
  terraformDir,
  terraformGraphFile,
  terraformStateFile,
} = require("./lexers");

describe("terraformDir", () => {
  it("should return a set of resources", () => {
    const resources = terraformDir("./test_fixtures/terraform");
    expect(resources.size).toBe(28);
  });
});

describe("terraformGraphFile", () => {
  it("should return a set of resources", () => {
    const resources = terraformGraphFile("./test_fixtures/graph.dot");
    expect(resources.size).toBe(66);
  });
});

describe("terraformStateFile", () => {
  it("should return a set of resources", () => {
    const resources = terraformStateFile("./test_fixtures/state.json");
    expect(resources.size).toBe(60);
  });
});
