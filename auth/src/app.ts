import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler } from "@ticketing-service-library/common";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
