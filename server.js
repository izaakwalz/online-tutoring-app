const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const admin = require('./routes/admin');
const tutor = require('./routes/tutor');

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use('/', (req, res) => {
//   res.status(200).send('Welcome to online tutorin app ');
// });

app.use('/api/v1/admin', admin);
app.use('/api/v1/tutor', tutor);

// app.use('*', (req, res) => {
//   res.status(404).send({
//     warning:
//       ' Opps~ you have reached the end of the Internet 💢💢🤣🤣🤣🤣㊗㊗😬',
//   });
// });

const PORT = process.env.PORT || 4000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
