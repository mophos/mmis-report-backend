import * as path from 'path';
let envPath = path.join(__dirname, '../../mmis-config');
require('dotenv').config(({ path: envPath }));

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as Knex from 'knex';
import { MySqlConnectionConfig } from 'knex';
import * as cors from 'cors';
import * as _ from 'lodash';

const protect = require('@risingstack/protect');

import { Jwt } from './models/jwt';
const jwt = new Jwt();

import index from './routes/index';
import reportsRoute from './routes/reports';
import uploadsRoute from './routes/uploads';
import stdRoute from './routes/standard';

const app: express.Express = express();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use(protect.express.xss({
  body: true,
  loggerFunction: console.error
}));

// Database connection string
let dbConnection: MySqlConnectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
}

// Database connection
app.use((req, res, next) => {
  req.db = Knex({
    client: 'mysql',
    connection: dbConnection,
    pool: {
      min: 0,
      max: 7,
      create: (conn, done) => {
        conn.query(`SET NAMES ${process.env.DB_ENCODING}`, (err) => {
          done(err, conn);
        });
      }
    },
    debug: process.env.SQL_DEBUG || true,
    acquireConnectionTimeout: 5000
  });

  next();
});

let checkAuth = (req, res, next) => {
  let token: string = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;
      next();
    }, err => {
      console.log(err);
      return res.send({
        ok: false,
        error: 'No token provided.',
        code: 403
      });
    });
}

let adminAuth = (req, res, next) => {
  const decoded = req.decoded;
  const accessRight = decoded.accessRight;
  try {
    if (accessRight) {
      const rights = accessRight.split(',');
      if (_.indexOf(rights, 'CM_ADMIN') > -1) {
        next();
      } else {
        res.send({ ok: false, error: 'No permission found!' });
      }
    } else {
      res.send({ ok: false, error: 'No permission found!' });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }
}

// Routing
app.use('/standard', checkAuth, stdRoute);
app.use('/reports', checkAuth, reportsRoute);
app.use('/uploads', checkAuth, uploadsRoute);
app.use('/', index);

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

app.use((err: Error, req, res, next) => {
  console.log(err);
  let errorMessage;
  switch (err['code']) {
    case 'ER_DUP_ENTRY':
      errorMessage = 'ข้อมูลซ้ำ';
      break;
    default:
      errorMessage = err;
      res.status(err['status'] || 500);
  }
  res.send({ ok: false, error: errorMessage });
});

export default app;
