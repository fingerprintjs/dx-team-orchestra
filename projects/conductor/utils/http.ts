import {APIRequestContext, APIResponse} from "@playwright/test";

export type RequestParams = Record<string, string | number>;

type JsonRequestOptions = {
  request: APIRequestContext,
  url: string,
  params?: RequestParams
  headers?: Record<string, string>
  method?: 'get' | 'delete'
};

export type JsonResponse<T> = {
  data: T;
  response: APIResponse
}

export async function jsonRequest<T = any>(
  {request, url, params, headers, method = 'get'}: JsonRequestOptions
): Promise<JsonResponse<T>> {
  const response = await request[method](url, {params, headers});
  if (!response.ok()) {
    const text = await response.text();
    console.error(`Request to ${url} failed with status ${response.status()}`, {
      params,
      method,
      headers,
      text
    });
    throw new Error(`Request failed with status ${response.status()}`);
  }

  return {
    data: await response.json(),
    response
  };
}