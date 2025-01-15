const accounts = {
  minimumFeatures: {
    region: "Global",
    publicKey: process.env.MINIMUM_US_DEFAULT_PUBLIC_KEY,
    privateKey: process.env.MINIMUM_US_DEFAULT_PRIVATE_KEY,
  },
  maximumFeatures: {
    region: "Global",
    publicKey: process.env.MAXIMUM_US_DEFAULT_PUBLIC_KEY,
    privateKey: process.env.MAXIMUM_US_DEFAULT_PRIVATE_KEY,
    deletedPrivateKey: process.env.MAXIMUM_US_DEFAULT_DELETED_PRIVATE_KEY,
  },
  regular: {
    region: "eu",
    publicKey: process.env.DEFAULT_EU_DEFAULT_PUBLIC_KEY,
    privateKey: process.env.DEFAULT_EU_DEFAULT_PRIVATE_KEY,
  }
}

export type Credential = {
  region: string
  publicKey: string
  privateKey: string
}

export type Credentials = {
  maxFeaturesUS: Credential
  invalid: Credential
}

export type Mocks = {
  invalid: {
    requestID: string,
    visitorId: string,
  }
}

const credentials: Credentials = {
  maxFeaturesUS: {
    region: accounts.maximumFeatures.region,
    publicKey: accounts.maximumFeatures.publicKey,
    privateKey: accounts.maximumFeatures.privateKey,
  },
  invalid: {
    publicKey: "ftxPJdxnMlP",
    privateKey: 'fz2%^pvvv',
    region: "AB",
  }
}

const mocks: Mocks = {
  invalid: {
    requestID: "ftxPJdxnMlP.ftxPJdxnMlP",
    visitorId: "gzm0RjeSe9g2netPpoWz",
  }
}

export const testData = {
  credentials,
  mocks,
  validSmartSignal: {
    apiKey: accounts.maximumFeatures.privateKey,
    region: accounts.maximumFeatures.region,
  },
  valid: {
    apiKey: accounts.minimumFeatures.privateKey,
    region: accounts.minimumFeatures.region,
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
    apiKey: accounts.maximumFeatures.privateKey,
    region: "eu",
  },
  deletedApiKey: {
    apiKey: accounts.maximumFeatures.deletedPrivateKey,
    region: accounts.maximumFeatures.region,
  },
  config: {
    baseURL: `http://localhost:${process.env.MUSICIAN_PORT || 3002}`,
    apiUrl: "https://api.fpjs.io",
  },

  identificationKey: {
    minimumFeaturesUS: accounts.minimumFeatures.publicKey,
    maximumFeaturesUS: accounts.maximumFeatures.publicKey,
    regularEU: accounts.regular.publicKey,
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
