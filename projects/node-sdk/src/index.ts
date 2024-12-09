import express, { Request, Response } from "express";

import {
  FingerprintJsServerApiClient,
  Region,
  RequestError,
} from "@fingerprintjs/fingerprintjs-pro-server-api";

const app = express();

const port = 3002;

function getRegion(region: string): Region {
  switch (region) {
    case "eu":
      return Region.EU;
    case "ap":
      return Region.AP;
    default:
      return Region.Global;
  }
}

app.get("/getEvents", async (req: Request, res: Response) => {
  const { apiKey = "", region = "", requestId = "" } = req.query;
  try {
    const client = new FingerprintJsServerApiClient({
      apiKey: apiKey.toString(),
      region: getRegion(region.toString()),
    });

    const event = await client.getEvent(requestId.toString());
    res.send({
      code: 200, // or 4**, 5** in case of error
      originalResponse: event,
      parsedResponse: event,
    });
  } catch (error) {
    if (error instanceof RequestError) {
      const originalResponse = await error.response.text();
      res.send({
        code: error.statusCode, // or 4**, 5** in case of error
        originalResponse: originalResponse,
        parsedResponse: error.responseBody,
      });
    } else {
      res.send({
        code: 500, // or 4**, 5** in case of error
        originalResponse: error,
        parsedResponse: error,
      });
    }
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
