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
  differentRegion: {
    apiKey: "ftxPJdxnMlPIeZV09RoT",
    region: "eu",
  },
  deletedApiKey: {
    apiKey: "ChMHgPDUzzr5qgTt4t45",
    region: "Global",
  },
  config: {
    baseURL: "http://localhost:3002",
  },
  generatidentification: {
    publicApiKey: "rO6UOgRbMculDuXmJl4g",
  },
};
export default testData;
