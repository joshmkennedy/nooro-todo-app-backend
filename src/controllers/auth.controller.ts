import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { UserPayload } from "../middleware/auth.middleware";

import db from "../db";

export class AuthController {
  public router: Router = Router();
  public db: PrismaClient;

  constructor() {
    this.db = db;
    this.initialize();
    this.initializeErrorHandling();
  }

  public initialize() {
    this.router.post("/signin", this.signin);
    this.router.post("/create-account", this.createAccount);
    this.router.post("/signout", this.signout);
  }

  public signin: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<any | void> = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    const { email, password } = request.body;
    // Validate user credentials here (e.g., check database, etc.)
    const user = await this.db.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      next(new Error("No User Found"));
      return;
    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      next(new Error("Wrong Password"));
    }

    const userPayload: UserPayload = {
      userId: user.id,
    };

    // Sign the token with your secret key
    // @ts-ignore
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "48h", // example: 1 hour
    });

    // Set the token in a cookie
    response.cookie("token", token, {
      httpOnly: true, // helps mitigate XSS
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      maxAge: 3600000, // 1 hour in milliseconds
    });
    response.json({ message: "Logged in successfully!" });
  };

  public createAccount: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<any | void> = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    next(new Error("NOT IMPLEMENTED"));
  };

  public signout: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<any | void> = async (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    return response.clearCookie("token").send();
  };

  private initializeErrorHandling() {
    this.router.use(
      (
        error: any,
        request: Request,
        response: Response,
        next: NextFunction,
      ): any | null => {
				response.status(400).send(error.message)
      },
    );
  }
}
