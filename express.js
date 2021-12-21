import path from "path";
import express from "express";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import toobusy from 'toobusy-js'

import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import jobRoutes from "./routes/job.routes.js";
import teamRoutes from "./routes/team.routes.js";
import pollRoutes from "./routes/poll.routes.js";
import playerRoutes from './routes/player.routes.js'
import attributeRoutes from "./routes/attribute.routes.js";
import matchRoutes from './routes/match.routes.js'
import newsRoutes from './routes/news.routes.js'
import postRoutes from './routes/post.routes.js'
import commentRoutes from './routes/comment.routes.js'
import statRoutes from './routes/statistics.routes.js'
import chatRoutes from './routes/chat.routes.js'





const CURRENT_WORKING_DIR = process.cwd();
const app = express();

dotenv.config()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors({
  credentials:true,
  origin:true,
}));
app.use(hpp())


// mount routes
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", departmentRoutes);
app.use("/", jobRoutes);
app.use("/", teamRoutes);
app.use("/", playerRoutes);
app.use("/", matchRoutes);
app.use("/", newsRoutes);
app.use("/", pollRoutes);
app.use("/", attributeRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);
app.use("/", statRoutes);
app.use("/", chatRoutes);

app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});



export default app;
