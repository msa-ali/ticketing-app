import express, { Request, Response } from "express";
import { validateRequest } from "../middlewares";
import { emailValidator, passwordValidator } from "./signup";
import { User } from "../models/user";
import { BadRequestError } from "../errors";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [emailValidator(), passwordValidator(), validateRequest],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials!");
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials!");
    }
    // generate JWT
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    // store it on session object
    req.session = {
      jwt: userJWT,
    };

    return res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
