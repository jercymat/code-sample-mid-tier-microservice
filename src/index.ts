import { Server } from 'http';
import createError from 'http-errors';
import csurf from 'csurf';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import apiRouter from './routes/api';
import {
  NODE_ENV,
  SERVICE_HOST,
  SOAP_AUTH_SECRET,
  VERTEX_PASSWORD,
} from './utils/config';
import { basicAuthMiddleware } from './utils/middleware';

/**
 * express app setup
 */
const app = express();

// morgan token for local timezone support
morgan.token('date-now', () => new Date().toLocaleString());

app.use(
  morgan(
    'INFO: :remote-addr - :remote-user [:date-now] ":method :url HTTP/:http-version" :status :res[content-length]',
  ),
);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'static')));

// don't cache
app.set('etag', false);

// rate limit
app.use(
  rateLimit({
    windowMs: 60000, // 1 minute
    max: 1000, // limit each IP to 100 requests per minute
    message: 'Too many requests from this IP, please try again later',
  }),
);

/**
 * CSRF protection
 */
const csrfProtection = csurf({ cookie: true });

/**
 * swagger
 */
const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Code Sample - Mid-Tier Microservice',
      version: process.env.npm_package_version ?? '0.0.0',
      description:
        'Code Sample of Mid-Tier Microservice for Vendor API Integration',
    },
    servers: [
      {
        url: SERVICE_HOST,
        description: 'Deployment Server',
      },
    ],
    security: [
      {
        ServiceAccount: [],
      },
    ],
  },
  // path to the API docs
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * routers
 */
app.use('/api', basicAuthMiddleware, apiRouter);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * fallback routes
 */
app.get('/swagger.json', (_: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(swaggerSpec);
});
app.get('/health', (_, res) => {
  res.json({ status: 'OK', environment: NODE_ENV || 'local' });
});
app.get('/', csrfProtection, (_: Request, res: Response) => {
  res.json({
    status: 'OK',
    environment: NODE_ENV || 'local',
    test1: VERTEX_PASSWORD?.substring(0, 3),
    test2: SOAP_AUTH_SECRET?.substring(0, 3),
  });
});

// catch 404 and forward to error handler
app.use((_1: Request, _2: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * server
 */

/**
 * Normalize a port into a number, string, or false.
 * @param {string|undefined} val - The port value to normalize.
 * @returns {number} The normalized port number.
 */
const normalizePort = (val: string | undefined): number => {
  const port = parseInt(val || '8080', 10);

  if (isNaN(port)) {
    return 8080;
  }

  if (port >= 0) {
    return port;
  }

  return 8080;
};

const port = normalizePort(process.env.PORT || '8080');
export const server: Server = app
  .listen(port, '0.0.0.0', async () => {
    const addr = server.address();
    const bind =
      typeof addr === 'string'
        ? addr
        : typeof addr === 'object' && addr
        ? `${addr.address}:${addr.port}`
        : '';
    console.info(`INFO: Listening on http://${bind}`);
  })
  .on('close', async () => {
    console.info('INFO: SERVER CLOSE\n');
  })
  .on('error', (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`ERROR: ${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`ERROR: ${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

export default app;
