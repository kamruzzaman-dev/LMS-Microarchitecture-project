import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelper";
import config from "../../config";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      console.log("i am here", token);
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret);
      req.user = verifiedUser; // role , userid

      // check by role // authenticated user
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden request !");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
