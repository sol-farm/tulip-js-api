const mongoose = require("mongoose");

const { DB_NAMESPACE, DB_PASSWORD, DB_USERNAME, CERT_PATH } = process.env;

const CONNECTION_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAMESPACE}/tulipapi?authSource=admin&replicaSet=tulip-api-db&tls=true&tlsCAFile=${CERT_PATH}`;

const start = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);
    return;
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

module.exports = {
  start,
};
