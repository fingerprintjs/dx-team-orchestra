import { Request, Response } from 'express'

export type Handler<QueryParams, RequestBody = {}> = (
  req: Request<{}, {}, RequestBody, QueryParams>,
  res: Response
) => Promise<void>

export type MusicianResponse<Response200Type> =
  | {
      code: 200
      originalResponse: Response200Type
      parsedResponse: Response200Type
    }
  | {
      code: number // or 4**, 5** in case of error
      originalResponse: unknown
      parsedResponse: unknown
    }
