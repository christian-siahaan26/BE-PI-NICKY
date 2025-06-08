import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getErrorMessage } from "../utils/error";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  lecturer?: { nidk: string; name: string; createdAt: string };
}

export const authorize = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorize",
    });
  }

  if (!SECRET_KEY) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  // Authorization = Bearer <token>
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as {
      nidk: string;
      name: string;
      createdAt: string;
    };

    req.lecturer = decoded;
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorize",
    });
  }
};
