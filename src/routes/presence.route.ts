import { Router } from "express";
import PresenceController from "../controllers/presence.controller";
import PresenceService from "../services/presence.service";
import PresenceRepository from "../repositories/presence.repository";
import { PrismaClient } from "@prisma/client";
import { resolve } from "path";

const router = Router();

const prismaClient = new PrismaClient();
const presenceRepository = new PresenceRepository(prismaClient);
const presenceService = new PresenceService(presenceRepository);
const presenceController = new PresenceController(presenceService);

router.post("/", (req, res, next) => presenceController.createPresence(req, res, next))
router.get("/", (req, res, next) => presenceController.getAllPresences(req, res, next))
router.get("/:id", (req, res, next) => presenceController.getPresenceById(req, res, next))
router.put("/:id", (req, res, next) => presenceController.updatePresence(req, res, next))
router.patch("/:id", (req, res, next) => presenceController.softDelete(req, res, next))

export default router;
