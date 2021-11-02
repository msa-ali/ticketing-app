import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler, currentUser } from "@ticketing-service-library/common";
import { createTicketRouter } from "./routes";


const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createTicketRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
