const ContentType = {
  ["html"]: "text/html; charset=UTF-8",
  ["js"]: "text/javascript; charset=UTF-8",
  ["css"]: "text/css",
  ["json"]: "application/json",
};

const RemoveHeaderList = [
  "x-content-type-options",
  "x-frame-options",
  "x-xss-protection",
  "x-github-request-id",
  "accept-ranges",
  "x-timer",
  "x-fastly-request-id",
  "source-age",
  "alt-svc",
  "content-security-policy",
  "strict-transport-security",
];

async function main(request, response) {
  try {
    const headers = response.headers;
    const name = "Content-Type";
    const uri = request.uri;
    console.log(uri, JSON.stringify(headers));

    const type = (() => {
      if (uri.endsWith(".js")) {
        return "js";
      } else if (uri.endsWith(".css")) {
        return "css";
      } else if (uri.includes("/api/") || uri.endsWith(".json")) {
        return "json";
      } else {
        return "html";
      }
    })();

    if (headers[name.toLowerCase()] != null || headers[name] != null) {
      headers[name.toLowerCase()] = [
        {
          key: name,
          value: ContentType[type],
        },
      ];
    }

    if ((type === 'js' || type === 'css') && uri.includes('_next/static')) {
      headers["cache-control"] = [
        {
          key: "Cache-Control",
          value: "max-age=31536000,s-maxage=31536000"
        }
      ];
    } else {
      headers["cache-control"] = [
        {
          key: "Cache-Control",
          value: "no-cache"
        }
      ];
    }

    for (const name of RemoveHeaderList) {
      delete headers[name];
      delete headers[name.toLowerCase()];
    }

    headers["x-set-cookie"] = [
      {
        key: "X-Set-Cookie",
        value: response.headers['x-set-cookie-2'][0].value
      }
    ];

    headers["set-cookie"] = [
      {
        key: "Set-Cookie",
        value: response.headers['x-set-cookie-2'][0].value
      }
    ];

    console.log(response.headers['set-cookie']);
    console.log(response.headers['x-set-cookie']);
    console.log(response.headers['x-set-cookie-2']);
  } catch (error) {
    console.error(error.message);
    console.error(error);
  }

  return response;
};

// const result = await new Function("eval_request","eval_response", functionStr).call(this, 1, 2);
return main(eval_request, eval_response);
