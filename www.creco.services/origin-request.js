async function main(request, response, { path }) {
  const url = request.uri;
  console.log({ url });

  const extension = path.extname(url);

  if (extension && extension.length > 0) {
    if (extension[0] === 'txt') {
      const redirect = {
        status: "302",
        statusDescription: "Found",
        headers: {
          location: [
            {
              key: "Location",
              value: `${url.replace('.txt', '')}/index.txt`,
            },
          ],
        },
      };
      console.log(`redirect to ${redirect.headers.location[0].value}`);
      
      return redirect;
    }

    return request;
  }

  if (url.endsWith("/")) {
    request.uri = url + "index.html";
    console.log(`serving to ${request.uri}`);
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
  console.log(`redirect to ${redirect.headers.location[0].value}`);

  return redirect;
}

// const path = require('path');
// const resopnse = await new Function("eval_request", "eval_response", "eval_packages", functionStr)
//                  .call(this, req, res, { path });
return main(eval_request, eval_response, eval_packages);
