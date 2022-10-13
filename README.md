# public-storage-lambda

- 동적으로 람다 코드를 실행할 수 있도록 처리합니다.
- ~~eval이 좋진 않지만, 매번 람다 함수 바꾸고 cloudfront 수정하고 반영하고 무효화하기에는 너무 먼 길을 걸어야하기에...~~


### Origin Response
```
const DYNAMIC_CODE_URL = `https://raw.githubusercontent.com/creco-storage/public-storage-lambda/main/www.creco.services/origin-response.js`;
const { get } = require("node:https");
const resolver = (rr) => {
  return (r, d = "") => {
    return [r.on("data", (c) => (d += c)), r.on("end", () => rr(d))];
  };
};

exports.handler = async (event, context, callback) => {
  const req = event.Records[0].cf.request;
  const res = event.Records[0].cf.response;

  const code = await new Promise((r) => get(DYNAMIC_CODE_URL, resolver(r)));
  
  const response = await new Function("eval_request","eval_response", code).call(this, req, res);

  callback(null, response);
};
```

### Origin Request
```
const path = require("path");

const DYNAMIC_CODE_URL = `https://raw.githubusercontent.com/creco-storage/public-storage-lambda/main/www.creco.services/origin-request.js`;
const { get } = require("node:https");
const resolver = (rr) => {
  return (r, d = "") => {
    return [r.on("data", (c) => (d += c)), r.on("end", () => rr(d))];
  };
};


exports.handler = async (event, context, callback) => {
  const req = event.Records[0].cf.request;
  const res = event.Records[0].cf.response;
  const packages = { path };

  const code = await new Promise((r) => get(DYNAMIC_CODE_URL, resolver(r)));

  const response = await new Function(
    "eval_request",
    "eval_response",
    "eval_packages",
    code
  ).call(this, req, res, packages);

  callback(null, response);
};

```
