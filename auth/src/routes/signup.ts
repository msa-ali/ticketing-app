import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError } from "../errors";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
import { validateRequest } from "../middlewares";

const router = express.Router();

export const emailValidator = () =>
  body("email").isEmail().withMessage("Email must be valid");

export const passwordValidator = () =>
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters!");

router.post(
  "/api/users/signup",

  [emailValidator(), passwordValidator(), validateRequest],

  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser) {
      throw new BadRequestError('Email already in use');
    }
    const user = User.build({email, password});
    await user.save();

    // generate JWT  
    const userJWT = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!
    );
    // store it on session object
    req.session = {
      jwt: userJWT,
    }

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
