const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb://lasup:azerazer@127.0.0.1/lasup", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      })
  
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
    } catch (error) {
      console.error(`Error: ${error.message}`.red.underline.bold)
      process.exit(1)
    }
  }
  
  module.exports = connectDB
  