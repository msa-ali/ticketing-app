import express from "express";
import "express-async-errors";
import mongoose from 'mongoose';

import { DatabaseConnectionError, NotFoundError } from "./errors";
import { errorHandler } from "./middlewares";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb instance...");
  } catch (error) {
    console.error(error);
  }
  app.listen(3000, () => {
    console.log("listening on port 3000!!");
  });
}
start();
