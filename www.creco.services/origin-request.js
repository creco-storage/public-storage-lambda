async function main(request, response, { path }) {
  const url = request.uri;
  const querystring = request.querystring;
  const hostname = request.headers?.['host']?.[0].value;
  console.log('v5');
  console.log({ url });
  console.log({ querystring });
  console.log({ hostname });

  if (url.startsWith('/api')) {
    const destDomain = 'app.divops.kr';

    request.origin = {
        custom: {
            domainName: destDomain,
            port: 443,
            protocol: 'https',
            path: '/github-api',
            sslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2'],
            readTimeout: 5,
            keepaliveTimeout: 5,
            customHeaders: {}
        }
    };

    request.headers['host'] = [{ key: 'host', value: destDomain}];

    return request;
  }

  const extension = path.extname(url);
  console.log('extension ' + extension);

  if (extension && extension.length > 0) {
    if (url.endsWith('index.txt')) {
      return request;
    } else if (extension === '.txt') {
      const value = url.replace('.txt', '') + "/index.txt";
      request.uri = value;

      return request;
    }

    return request;
  }

  if (url.endsWith("/")) {
    request.uri = url + "index.html";
    console.log("serving to " + request.uri);
    return request;
  } else {
    request.uri = url + "/index.html";
    console.log("serving to " + request.uri);
    return request;
  }

  return redirect;
}

// const path = require('path');
// const resopnse = await new Function("eval_request", "eval_response", "eval_packages", functionStr)
//                  .call(this, req, res, { path });
return main(eval_request, eval_response, eval_packages);
