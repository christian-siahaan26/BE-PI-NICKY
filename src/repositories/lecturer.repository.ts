import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { SignUpDTO } from "../types/lecturer";

export default class LecturerRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createLecturer(lecturer: SignUpDTO) {
    try {
      return await this.prisma.lecturer.create({
        data: lecturer
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("NIDK already exists");
        }
      }
      throw new Error("Error creating lecturer");
    }
  }

  async getLecturerByNidk(nidk: string) {
    try {
        return await this.prisma.lecturer.findUnique({
            where: {
                nidk
            }
        })
    } catch (error){
        throw new Error("Error getting lecturer")
    }
  }
}
