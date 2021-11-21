import mongoose from 'mongoose'

import config from "./config/config.js";
import app from "./express.js";


mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGODB_LINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${process.env.MONGODB_LINK}`);
});



app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});


