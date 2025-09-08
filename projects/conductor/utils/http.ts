import { APIRequestContext, APIResponse } from '@playwright/test'

type Primitive = string | number | boolean
export type RequestParams = Record<string, Primitive | Primitive[] | RequestParams>

type JsonRequestOptions = {
  request: APIRequestContext
  url: string
  headers?: Record<string, string>
} & ({ method?: 'get'; params?: RequestParams } | { method: 'post'; params?: any; data?: unknown })

export type JsonResponse<T> = {
  data: T
  response: APIResponse
}

function buildQuery(
  obj: RequestParams,
  opts: { arrayFormat?: 'repeat' | 'brackets' } = { arrayFormat: 'repeat' }
): string {
  const out = new URLSearchParams()

  const append = (key: string, value: Primitive | Primitive[]) => {
    if (Array.isArray(value)) {
      if (opts.arrayFormat === 'brackets') {
        value.forEach((v) => out.append(`${key}[]`, String(v)))
      } else {
        value.forEach((v) => out.append(key, String(v))) // repeat: key=a&key=b
      }
    } else {
      out.append(key, String(value))
    }
  }

  const walk = (prefix: string, value: any) => {
    // Skip if the value is either `undefined` or `null`, doesn't skip for other falsy values. Double equals(`==`) expression used on purpose.
    if (value == null) {
      return
    }
    if (Array.isArray(value) || ['string', 'number', 'boolean'].includes(typeof value)) {
      append(prefix, value as any)
      return
    }
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      walk(`${prefix}[${k}]`, v)
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    walk(key, value)
  }
  return out.toString()
}

export async function jsonRequest<T = any>({
  request,
  url,
  params,
  headers,
  method = 'get',
}: JsonRequestOptions): Promise<JsonResponse<T>> {
  let finalUrl = url
  const args: any = { headers }

  if (method === 'get' && params) {
    const queryString = buildQuery(params, { arrayFormat: 'repeat' })
    if (queryString) {
      finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
    }
  } else if (method === 'post') {
    args.data = params
  }

  const response = await request[method](finalUrl, args)
  if (!response.ok()) {
    const text = await response.text()
    console.error(`Request to ${finalUrl} failed with status ${response.status()}`, {
      params,
      method,
      headers,
      text,
    })
    throw new Error(`Request failed with status ${response.status()}`)
  }

  return { data: await response.json(), response }
}
