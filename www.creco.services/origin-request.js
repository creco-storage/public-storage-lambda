async function main(request, response, { path }) {
  const url = request.uri;
  const querystring = request.querystring;
  console.log('v5');
  console.log({ url });
  console.log({ querystring });
  console.log({ request });

  const extension = path.extname(url);
  console.log('extension ' + extension);

  if (extension && extension.length > 0) {
    if (url.endsWith('index.txt')) {
      return request;
    } else if (extension === '.txt') {
      const value = url.replace('.txt', '') + "/index.txt" + "?" + querystring;
      console.log("redirect to " + value);
      
      const redirect = {
        status: "302",
        statusDescription: "Found",
        headers: {
          location: [
            {
              key: "Location",
              value,
            },
          ],
        },
      };
      
      return redirect;
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

  // const value = url + "/" + "?" + querystring;
  // const redirect = {
  //   status: "302",
  //   statusDescription: "Found",
  //   headers: {
  //     location: [
  //       {
  //         key: "Location",
  //         value,
  //       },
  //     ],
  //   },
  // };
  // console.log("redirect to " + value);

  // return redirect;
}

// const path = require('path');
// const resopnse = await new Function("eval_request", "eval_response", "eval_packages", functionStr)
//                  .call(this, req, res, { path });
return main(eval_request, eval_response, eval_packages);
