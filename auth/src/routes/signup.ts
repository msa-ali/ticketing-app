import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError, BadRequestError } from "../errors";
import { User } from "../models/user";

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

  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser) {
      throw new BadRequestError('Email already in use');
    }
    const user = User.build({email, password});
    await user.save();
    return res.status(201).send(user);
  }
);

export { router as signupRouter };
