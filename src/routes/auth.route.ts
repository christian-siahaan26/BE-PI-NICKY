import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import UserRepository from "../repositories/lecturer.repository";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import LecturerRepository from "../repositories/lecturer.repository";

const router = Router();

const prismaClient = new PrismaClient();
const lecturerRepository = new LecturerRepository(prismaClient);
const authService = new AuthService(lecturerRepository);
const lecturerController = new AuthController(authService);

router.post("/signup", (req, res) => lecturerController.signUp(req, res));
router.post("/signin", (req, res) => lecturerController.signIn(req, res));
router.post("/authorize", (req, res) => lecturerController.authorize(req, res));

export default router;
