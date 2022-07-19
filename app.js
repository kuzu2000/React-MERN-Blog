const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const authRoute = require('./Routes/authRoute');
const postRoute = require('./Routes/postRoute');
const favouriteRoute = require('./Routes/favouriteRoute');
const userRoute = require('./Routes/userRoute');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Routes/errorRoutes');
const path = require('path');
const multer = require('multer');

app.use(cors());

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    "img-src": ["'self'", "https: data:"]
  }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limit = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api/auth', limit);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use("/images", express.static(path.join(__dirname, "/images")))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded');
});
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/favourite', favouriteRoute);
app.use('/api/users', userRoute);

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use(globalErrorHandler);


module.exports = app;
