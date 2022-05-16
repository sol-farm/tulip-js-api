require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongo = require('./config/mongodb');
const http = require('http');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit').default;
const indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const RATE_LIMIT_WINDOW_MINUTES = 1;
const RATE_LIMIT_WINDOW_MAX = 1000;

const app = express();

/**
 * Set up Helmet to avoid info leak
 */
app.use(helmet());
app.use(helmet.hidePoweredBy());


/**
 * Set up rate-limiting to avoid DDoS
 */
// const limiter = rateLimit({
//   windowMs: RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
//   max: RATE_LIMIT_WINDOW_MAX,
//   handler: function (req, res, /*next*/) {
//     return res.json({ msg: "Too many requests" });
//   }
// });

// app.use();


/**
 * Allow Cross origin domain requests
 */

app.use(cors({
  origin: '*'
}));


/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

app.set('json spaces', 2);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/', indexRouter);

const options = {
  explorer: true
};

// Documentation
const swaggerDocument = YAML.load('./docs/index.yaml');
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.json({ msg: "no route found" });
});


const port = normalizePort(process.env.SERVER_PORT || '3000');

app.set('port', port);

const main = async () => {
  // Start databse connection
  await mongo.start();

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);

  console.log(`Express server started at port: ${port}`);
};

main();

