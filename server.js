const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();
const appApp = require('./routes/general');
const admin = require('./routes/admin');
const tutor = require('./routes/tutors');
const stundent = require('./routes/stundents');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/api/v1/app', appApp);
app.use('/api/v1/admin', admin);
app.use('/api/v1/tutor', tutor);
app.use('/api/v1/stundent', stundent);

app.use('*', (req, res) => {
  res
    .status(404)
    .send(
      ' Opps~ this is the end of the world api😬, Please try entring a valid route'
    );
});

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
