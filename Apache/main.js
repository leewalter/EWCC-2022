export function onOriginResponse(request, response) {
  var servername = response.getHeader('Server')[0];
  var etag1 = response.getHeader('ETag')[0];
  if (servername.startsWith('Apache') && etag1.endsWith('-gzip"')) {
    response.removeHeader('ETag');
  }
}
