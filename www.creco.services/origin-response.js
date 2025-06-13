const CONTENT_TYPE = {
  ["html"]: "text/html; charset=UTF-8",
  ["js"]: "text/javascript; charset=UTF-8",
  ["css"]: "text/css",
  ["json"]: "application/json",
  ["svg"]: "image/svg+xml",
  ["xml"]: "application/xml; charset=UTF-8",
  ["txt"]: "text/plain; charset=UTF-8",
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
    if (request.uri != null && response.status === '404') {
      const originDomain = request.origin?.custom?.domainName;
      const originPath = request.origin?.custom?.path;
      const segments = request.uri.split('/');

      if (originDomain != null && originPath != null && segments.length > 1) {
        console.log({ originDomain, originPath, segments_1: segments[1] });
        const url = `https://${originDomain}${originPath}/${segments[1]}/404/index.html`;
        const raw404 = await fetch(url).then(x => x.text());

        console.log({ raw404 });
        response.body = raw404;
      }
    }

    const headers = response.headers;
    const name = "Content-Type";
    const uri = request.uri;

    const type = (() => {
      if (uri.endsWith(".js")) {
        return "js";
      } else if (uri.endsWith(".css")) {
        return "css";
      } else if (uri.includes("/api/") || uri.endsWith(".json")) {
        return "json";
      } else if (uri.endsWith(".svg")) {
        return "svg";
      } else if (uri.endsWith(".xml")) {
        return "xml";
      } else if (uri.endsWith(".txt")) {
        return "txt";
      } else {
        return "html";
      }
    })();

    if (headers[name.toLowerCase()] != null || headers[name] != null) {
      headers[name.toLowerCase()] = [
        {
          key: name,
          value: CONTENT_TYPE[type],
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
  } catch (error) {
    console.error(error.message);
    console.error(error);
  }

  return response;
};

// const result = await new Function("eval_request","eval_response", functionStr).call(this, 1, 2);
return main(eval_request, eval_response);
