function sendResponse(res, statusCode, data) {
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

module.exports = { sendResponse };
