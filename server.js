import mongoose from "mongoose";
import http from 'http'
import app from "./express.js";
import socket from "./controllers/socket.controller.js";

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_LINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${process.env.MONGODB_LINK}`);
});

// const server = app.listen(process.env.PORT, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.info("Server started on port %s.", process.env.PORT);
// });

const server = http.createServer(app);

socket(server);

server.listen(process.env.PORT, () => console.log(`Server has started.`));
