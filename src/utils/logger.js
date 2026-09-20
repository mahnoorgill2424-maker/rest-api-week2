const logger = {
  info: (meta, msg) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", message: msg,...meta }));
  },
  error: (meta, msg) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", message: msg,...meta }));
  }
};
module.exports = logger;