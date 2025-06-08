import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { getErrorMessage } from "../utils/error";
import { generateToken, verifyToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

export default class AuthController {
  private authServise: AuthService;

  constructor(authService: AuthService) {
    this.authServise = authService;
  }

  async signUp(req: Request, res: Response) {
    try {
      const { nidk, name, password } = req.body;

      if (!nidk || !name || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const {
        nidk: lecturerNidk,
        name: lecturerName,
        createdAt: lecturerCreatedAt,
        error,
      } = await this.authServise.signUp({ nidk, name, password });
      if (error) {
        return res.status(500).json({
          success: false,
          message: error,
        });
      }

      if (!lecturerNidk || !lecturerName || !lecturerCreatedAt) {
        return res.status(500).json({
          success: false,
          message: "Failed to sign up user",
        });
      }

      const token = generateToken(lecturerNidk, lecturerName, lecturerCreatedAt);
      return res.status(201).json({
        success: true,
        message: "Lecturer created",
        data: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { nidk, password } = req.body;

      if (!nidk || !password) {
        return res.status(400).json({
          success: false,
          message: "NIDK and Password are required",
        });
      }

      const { token, error } = await this.authServise.signIn(nidk, password);
      if (error) {
        return res.status(500).json({
          success: false,
          message: getErrorMessage(error),
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login success",
        data: token,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: getErrorMessage(error),
      });
    }
  }

  async authorize(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1] ?? "";
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }

      const { nidk, name } = decoded;
      if (!nidk || !name) {
        return res.status(400).json({
          success: false,
          message: "Invalid token",
        });
      }

      const newToken = generateToken(decoded.nidk, decoded.name, decoded.createdAt)
      return res.status(200).json({
        success: true,
        message: "Success",
        data: newToken
      })
    } catch (error) {
        return res.status(500).json({
          success: false,
          message: getErrorMessage(error),
        });
    }
  }
}
