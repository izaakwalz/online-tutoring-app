const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI_Local_Host}`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false, //! Mongoose: deprecated. stuff, for future use updateOne()
      }
    );
    console.log(`MongoDB Connected: localhost`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
