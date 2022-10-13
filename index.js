// const result = await new Function("eval_request","eval_response", functionStr).call(this, 1, 2);

async function originRequest(req, res) {
  return new Promise((resolve, reject) => {
    try {
      return resolve(req + res);
    } catch (error) {
      return reject(error);
    }
  });
}

return originRequest(eval_request, eval_response);
