import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

export type UserPayload = {
  userId: string;
};

export class AuthMiddleware {
  public async initialize(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<any | void> {
    try {
      let token = request.cookies.token; // cookie name: "token"
      if (!token) {
				const authToken = request.headers['authorization']
				if(!authToken){
        return response.status(401).json({ error: "No token provided" });
				}
				token = authToken.replace("Bearer ", "")
      }
			

      // Verify token (make sure you have a secret key stored in an env variable)
      // @ts-ignore
      const decoded: UserPayload | null = jwt.verify(
        token,
        //@ts-ignore
        process.env.JWT_SECRET,
      );
      if (decoded?.userId) {
        // Attach decoded user data to the request object (if needed later)
        request.user = decoded;
        // Proceed to the next handler if everything checks out
        next();
      }
    } catch (err) {
      // pass to error handling
      return response.status(401).json({ error: "Invalid or expired token" });
    }
    return;
  }

}
