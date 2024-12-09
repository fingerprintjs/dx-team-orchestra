export async function getApiRequest(request, url, params) {
  const response = await request.get(url, { params });
  const responseBody = await response.json();
  return responseBody;
}
