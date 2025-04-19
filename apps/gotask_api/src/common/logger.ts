import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";
import config from "config";

const loggerFormat = bunyanFormat({
  outputMode: "bunyan",
  levelInString: true
});

// create a logger instance
const logger = bunyan.createLogger({
  name: config.get("app.name"),
  stream: loggerFormat,
  level: config.get("app.logLevel"),
  serializers: bunyan.stdSerializers
});

export default logger;
