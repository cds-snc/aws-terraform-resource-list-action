const { markdown } = require("./formatters");

describe("markdown", () => {
  it("should render markdown", () => {
    const resourceList = {
      "Category 1": [
        {
          type: "Type 1",
          name: "Name 1",
        },
        {
          type: "Type 2",
          name: "Name 2",
        },
      ],
      "Category 2": [
        {
          type: "Type 3",
          name: "Name 3",
        },
        {
          type: "Type 4",
          name: "Name 4",
        },
      ],
    };

    const expected = `

## Resource list
- [Category 1](#category-1)
- [Category 2](#category-2)


***


### <a id="category-1"></a>Category 1
| Type | Name |
| --- | --- |
| Type 1 | Name 1 |
| Type 2 | Name 2 |


### <a id="category-2"></a>Category 2
| Type | Name |
| --- | --- |
| Type 3 | Name 3 |
| Type 4 | Name 4 |


`;

    const result = markdown(resourceList);

    expect(result).toEqual(expected);
  });
});
