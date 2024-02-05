const sendResponse = (res, status, message, data) => {
  return res.json({
    status,
    message,
    data,
  });
};

module.exports = { sendResponse };
