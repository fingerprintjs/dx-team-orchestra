const testData = {
  valid: {
    apiKey: "ftxPJdxnMlPIeZV09RoT",
    region: "Global",
  },
  missing: {
    apiKey: "",
    region: "",
    requestID: "",
  },
  invalid: {
    apiKey: "ftxPJdxnMlP",
    region: "AB",
    requestID: "ftxPJdxnMlP.ftxPJdxnMlP",
  },
  config: {
    baseURL: "http://localhost:3002",
  },
  generatidentification: {
    publicApiKey: "rO6UOgRbMculDuXmJl4g",
  },
};
export default testData;
