// based on https://github.com/akamai/edgeworkers-examples/blob/master/edgecompute/examples/stream/find-replace-stream/main.js
// see also PR at https://github.com/akamai/edgeworkers-examples/pull/137

/* https://github.com/akamai/edgeworkers-examples/blob/master/edgecompute/examples/stream/find-replace-stream/main.js
(c) Copyright 2020 Akamai Technologies, Inc. Licensed under Apache 2 license.

Version: 1.1
Purpose:  Modify an HTML streamed response by replacing a text string two times across the entire response.

*/

import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';
import { TextEncoderStream, TextDecoderStream } from 'text-encode-transform';
import { FindAndReplaceStream } from 'find-replace-stream.js';

export function responseProvider (request) {
  // Get text to be searched for and new replacement text from Property Manager variables in the request object.
  // const tosearchfor = request.getVariable('PMUSER_EWSEARCH');
  // const newtext = request.getVariable('PMUSER_EWNEWTEXT');
  // hardcode here because PM variables not working
  const tosearchfor =  'test.js';
  const newtext =  'test.js?version=2';
  // Must set a number larger than 0 to alow and limit replacements
  const howManyReplacements = 99;

  return httpRequest(`${request.scheme}://${request.host}${request.url}`).then(response => {
    // Get headers from response
    let headers = response.getHeaders();
    // Remove content-encoding header.  The response stream from EdgeWorkers is not encoded.
    // If original response contains `Content-Encoding: gzip`, then the Content-Encoding header does not match the actual encoding. 
    delete headers["content-encoding"];
    // Remove `Content-Length` header.  Find/replace is likely to change the content length.
    // Leaving the Length of the original content would be incorrect.
    delete headers["content-length"];
    
    return createResponse(
      response.status,
      headers,
      response.body
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new FindAndReplaceStream(tosearchfor, newtext, howManyReplacements))
          .pipeThrough(new TextEncoderStream())
    );
  });
}
