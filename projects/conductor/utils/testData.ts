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
    visitorId: "gzm0RjeSe9g2netPpoWz",
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
  updateEventComplexTag: {
    tag: {
      automationTest_testName: "Automation Test Scenario 1",
      automationTest_testId: `test_${Math.random()
        .toString(36)
        .substring(2, 8)}`,
      automationTest_metadata: {
        id: Math.floor(Math.random() * 1000),
        description: "This is a metadata description for automation testing.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      automationTest_settings: {
        retries: 3,
        timeout: 5000,
        environment: "staging",
        notifications: ["email", "slack", "sms"],
      },
      automationTest_users: [
        { userId: "123", roles: ["admin", "editor"], isActive: true },
        { userId: "456", roles: ["viewer"], isActive: false },
      ],
      automationTest_metrics: [
        { name: "executionTime", value: 120.5, unit: "seconds" },
        { name: "memoryUsage", value: 256, unit: "MB" },
        { name: "assertionsPassed", value: 100 },
      ],
      automationTest_logs: [
        {
          timestamp: new Date().toISOString(),
          level: "info",
          message: "Test started.",
        },
        {
          timestamp: new Date().toISOString(),
          level: "error",
          message: "Assertion failed.",
        },
      ],
    },
  },
};

export default testData;
