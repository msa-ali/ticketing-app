import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError, RequestValidationError } from "../errors";

const router = express.Router();

const emailValidator = () =>
  body("email").isEmail().withMessage("Email must be valid");

const passwordValidator = () =>
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters!");

router.post(
  "/api/users/signup",

  [emailValidator(), passwordValidator()],

  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    console.log("Creating a user...");

    throw new DatabaseConnectionError();

    res.send({ signup: true });
  }
);

export { router as signupRouter };
