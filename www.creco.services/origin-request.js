async function main(request, response, { path }) {
  const [url, queryString] = request.uri?.split('?');

  const extension = path.extname(url);

  if (extension && extension.length > 0) {
    return request;
  }

  if (url.endsWith("/")) {
    request.uri = url + "index.html" + "?" + queryString;
    return request;
  }

  const redirect = {
    status: "302",
    statusDescription: "Found",
    headers: {
      location: [
        {
          key: "Location",
          value: `${url}/?${queryString}`,
        },
      ],
    },
  };
  
  return redirect;
}

// const path = require('path');
// const resopnse = await new Function("eval_request", "eval_response", "eval_packages", functionStr)
//                  .call(this, req, res, { path });
return main(eval_request, eval_response, eval_packages);
