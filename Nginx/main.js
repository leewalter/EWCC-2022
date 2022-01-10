export function onOriginRequest(request) {
  request.removeHeader('Via');
}
