require('dotenv').config();
//setup database connection
require('./models');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes');
const apiErrors = require('./middlewares/error');
//initialize express app
const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
//initialize socket.io server
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.set('trust proxy', 1);
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

//only run morgan in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: false }));
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: true,
};

app.use(cookieParser(cookieOptions));
app.use(
  '/public/uploads/avatar/',
  express.static(path.join(process.cwd() + '/public/uploads/avatar/'))
);
app.use(
  '/public/uploads/products/',
  express.static(path.join(process.cwd() + '/public/uploads/products/'))
);
//setup routes:
apiRoutes(app);

app.use(apiErrors.notFound);
app.use(apiErrors.customError);
app.use(apiErrors.serverError);

app.use((error, req, res, next) => {
  // Sets HTTP status code
  res.status(error.status || 500);

  // Sends response
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    // You can define production mode here so that the stack trace will not be sent.
    const isProd = false;
    res.status(err.status || 500).json({
      error: err.toString(),
      ...(!isProd && { stack: err.stack.split('\n').map((i) => i.trim()) }),
    });
  }
  next(err);
});

// Change app.listen to server.listen
server.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});

app.set('socketio', io);
