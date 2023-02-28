const { categorize } = require("./categorize");

describe("categorize", () => {
  it("should categorize resources", () => {
    resources = [
      "aws_api_gateway_api_key.test",
      "aws_api_gateway_stage.test",
      "aws_api_gateway_rest_api.test",
      "aws_amplify_domain_association.test",
      "aws_db_event_subscription.test",
    ];

    const expected = {
      "API Gateway": [
        {
          type: "aws_api_gateway_api_key",
          name: "test",
        },
        {
          type: "aws_api_gateway_rest_api",
          name: "test",
        },
        {
          type: "aws_api_gateway_stage",
          name: "test",
        },
      ],
      Amplify: [
        {
          type: "aws_amplify_domain_association",
          name: "test",
        },
      ],
      "RDS (Relational Database)": [
        {
          type: "aws_db_event_subscription",
          name: "test",
        },
      ],
    };

    const result = categorize(resources);
    expect(result).toEqual(expected);
  });
});
