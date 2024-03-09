const mongoose = require("mongoose");

// Define a function to connect to the MongoDB database
const connectDb = async () => {
  try {
    // Attempt to connect to the MongoDB database using the provided connection string
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);

    // If the connection is successful, log the host and database name to the console
    console.log(
      "Database Details: \n" + connect.connection.host,
      "\nDBName: " + connect.connection.name
    );
  } catch (err) {
    // If an error occurs during the connection attempt, log the error and exit the process
    console.log(err);
    process.exit(1);
  }
};

// Export the connectDb function to make it accessible from other modules
module.exports = connectDb;