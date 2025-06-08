import { NextFunction, Response } from "express";
import { responses } from "../constants";
import { AuthRequest } from "../middleware/auth";
import PresenceService from "../services/presence.service";
import { PresenceFilters } from "../types/presence";
import { PaginationParams } from "../types/pagination";

class PresenceController {
  private presenceService: PresenceService;

  constructor(presenceService: PresenceService) {
    this.presenceService = presenceService;
  }

  async getAllPresences(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.lecturer) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit
          ? parseInt(req.query.limit as string)
          : undefined,
      };

      const filters: PresenceFilters = {
        search: req.query.search as string,
        startDate: req.query.startDate
          ? new Date(req.query.startDate as string)
          : undefined,
        endDate: req.query.endDate
          ? new Date(req.query.endDate as string)
          : undefined,
      };

      const result = await this.presenceService.getAllPresences(
        req?.lecturer.nidk,
        pagination,
        filters
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      res.status(200).json({
        succes: true,
        message: responses.successGetPresences,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPresenceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.lecturer) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.presenceService.getPresenceById(
        Number(req.params.id),
        req.lecturer.nidk
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(200).json({
        success: true,
        message: responses.successGetPresences,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPresence(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.lecturer) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.presenceService.createPresence({
        status: req.body.status,
        description: req.body.description,
        course: req.body.course,
        npm: req.body.npm,
        nameStudent: req.body.nameStudent,
        clas: req.body.clas,
        major: req.body.major,
        nidk: req.lecturer.nidk,
        nameLecturer: req.lecturer.name
      });

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(201).json({
        success: true,
        message: responses.successCreatePresence,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePresence(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.lecturer) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.presenceService.updatePresence(
        req.lecturer.nidk,
        Number(req.params.id),
        req.body
      );

      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(200).json({
        success: true,
        message: responses.successUpdatePresence,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async softDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.lecturer) {
        return res.status(400).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.presenceService.softDelete(Number(req.params.id), req.lecturer.nidk) 
      if (typeof result === "string") {
        return res.status(400).json({
          success: false,
          message: result,
        });
      }

      return res.status(204).json({
        success: true,
        message: responses.successUpdatePresence
      });
    } catch (error) {
        next(error)
    }
  }
}

export default PresenceController;
