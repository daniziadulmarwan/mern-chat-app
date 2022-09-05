const mongoose = require("mongoose");

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected".underline.cyan);
  } catch (error) {
    console.log("Error ".red + error.red);
    process.exit();
  }
};

module.exports = connection;
