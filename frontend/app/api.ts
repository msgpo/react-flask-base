import { stringify } from 'query-string';
import { SERVER_URL } from 'config';

export function apiUrl(uri, queryParams) {
  return _url(`/${uri}`, queryParams);
}

export function accountUrl(uri, queryParams) {
  return apiUrl(`account${uri}`, queryParams);
}

export function adminUrl(uri, queryParams) {
  return apiUrl(`admin${uri}`, queryParams);
}

export function _url(uri, queryParams) {
  const baseUrl = `${SERVER_URL}${uri}`;
  return queryParams
    ? `${baseUrl}?${stringify(queryParams)}`
    : baseUrl;
}
