/**
 * Lightweight structured logger for backend request and application logging.
 */
const isProduction = process.env.NODE_ENV === 'production';

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  if (isProduction) {
    return JSON.stringify({
      timestamp,
      level,
      message: typeof message === 'string' ? message : undefined,
      ...(typeof message === 'object' ? message : {}),
      ...meta,
    });
  }

  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${typeof message === 'string' ? message : JSON.stringify(message)}${metaStr}`;
};

const logger = {
  info: (message, meta) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message, meta) => {
    if (message instanceof Error) {
      const errMeta = {
        stack: message.stack,
        code: message.code,
        statusCode: message.statusCode,
        ...meta,
      };
      console.error(formatMessage('error', message.message, errMeta));
    } else {
      console.error(formatMessage('error', message, meta));
    }
  },
  debug: (message, meta) => {
    if (!isProduction) {
      console.debug(formatMessage('debug', message, meta));
    }
  },
};

module.exports = logger;
