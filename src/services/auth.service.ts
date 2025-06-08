import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignUpDTO } from "../types/lecturer";
import LecturerRepository from "../repositories/lecturer.repository";
import { getErrorMessage } from "../utils/error";

const SECRET_KEY = process.env.JWT_SECRET as string;

export default class AuthService {
  private lecturerRepository: LecturerRepository;

  constructor(lecturerRepository: LecturerRepository) {
    this.lecturerRepository = lecturerRepository;
  }

  async signUp(lecturer: SignUpDTO): Promise<{
    nidk: string | null;
    name: string | null;
    createdAt: Date | null;
    error: string | null;
  }> {
    try {
      const hashedPassword = await bcrypt.hash(lecturer.password, 10);

      const { nidk, name, createdAt } = await this.lecturerRepository.createLecturer({
        ...lecturer,
        password: hashedPassword,
      });

      return {
        nidk,
        name,
        createdAt,
        error: null,
      };
    } catch (error) {
      return {
        nidk: null,
        name: null,
        createdAt: null,
        error: getErrorMessage(error),
      };
    }
  }

  async signIn(nidk: string, password: string): Promise<{ token: string | null; error: string | null}> {
    try {
        const lecturer = await this.lecturerRepository.getLecturerByNidk(nidk)
        if (!lecturer) return { token: null, error: "Invalid NIDK or Password"}

        const isMatch = await bcrypt.compare(password, lecturer.password)
        if (!isMatch) return { token: null, error: "Invalid NIDK or Password"}

        const token = jwt.sign({
            nidk: lecturer.nidk,
            name: lecturer.name,
            createdAt: lecturer.createdAt
        }, SECRET_KEY, {
            expiresIn: 7200
        })

        return {
            token,
            error: null
        }
    } catch (error) {
        throw new Error(getErrorMessage(error))
    }
  }
}
