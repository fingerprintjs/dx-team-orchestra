const testData = {
  validSmartSignal: {
    apiKey: "ftxPJdxnMlPIeZV09RoT",
    region: "Global",
  },
  valid: {
    apiKey: "BCSjInUvHRIOKTpEuIF2",
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
    baseURL: `http://localhost:${process.env.MUSICIAN_PORT || 3002}`,
    apiUrl: "https://api.fpjs.io",
  },
  generatidentification: {
    publicApiKeySS: "rO6UOgRbMculDuXmJl4g",
    publicApiKey: "GyvQGYtzxEmK6JszqXaA",
  },

  updateEvent: {
    linkedId: `linkedId_${Math.floor(Math.random() * 1000)}`,
    suspect: Math.random() < 0.5,
    tag: {
      automationTest: `test_${Math.random().toString(36).substring(2, 10)}`,
    },
  },
};

export default testData;
