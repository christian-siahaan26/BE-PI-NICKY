import { PrismaClient, Prisma } from "@prisma/client";
import {
  Presence as PresenceDTO,
  CreatePresenceDto,
  UpdatePresenceDto,
  PresenceFilters,
} from "../types/presence";

import PresenceModel from "../models/presence.model";

import { PaginationParams } from "../types/pagination";
import { getErrorMessage } from "../utils/error";
import { connect } from "http2";

class PresenceRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(
    nidk: string,
    pagination?: PaginationParams,
    filters?: PresenceFilters
  ): Promise<{ presences: PresenceDTO[]; total: number } | string> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 24;
      const skip = (page - 1) * limit;
      const isNumber = !isNaN(Number(filters?.search));
      const isBoolean =
        filters?.search?.toLowerCase() === "true" ||
        filters?.search?.toLowerCase() === "false";

      const where: Prisma.PresenceWhereInput = {
        isDeleted: false,
        nidk,
        ...(filters?.search && {
          OR: [
            {
              description: {
                contains: filters.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              course: {
                contains: filters.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            ...(isNumber
              ? [
                  {
                    npm: Number(filters.search),
                  },
                ]
              : []),
            ...(isBoolean
              ? [
                  {
                    status: filters.search.toLocaleLowerCase() === "true",
                  },
                ]
              : []),
          ],
        }),
        ...(filters?.startDate && { createdAt: { gte: filters.startDate } }),
        ...(filters?.endDate && { createdAt: { lte: filters.endDate } }),
      };

      const [presences, total] = await Promise.all([
        this.prisma.presence.findMany({
          where,
          include: {
            presenceLecturer: true,
            presenceStudent: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),
        this.prisma.presence.count({ where }),
      ]);

      return {
        presences: presences.map((presence) =>
          PresenceModel.fromEntity(presence).toDTO()
        ),
        total,
      };
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async findById(
    id: number,
    nidk: string
  ): Promise<PresenceDTO | null | string> {
    try {
      const presence = await this.prisma.presence.findFirst({
        where: {
          id,
          nidk,
          isDeleted: false,
        } as Prisma.PresenceWhereInput,
      });

      return presence ? PresenceModel.fromEntity(presence).toDTO() : null;
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async create(presenceData: CreatePresenceDto): Promise<PresenceDTO | string> {
    try {
      const lecturer = await this.prisma.lecturer.findUnique({
        where: { nidk: presenceData.nidk },
      });
      if (!lecturer) return "Lecturer with given NIDK not found";

      const student = await this.prisma.student.findUnique({
        where: { npm: presenceData.npm },
      });
      if (!student) return "Student with given NPM not found";

      const presence = await this.prisma.presence.create({
        data: {
          status: presenceData.status,
          description: presenceData.description,
          course: presenceData.course,
          nameLecturer: lecturer.name,
          clas: student.clas,
          major: student.major,
          nameStudent: student.name,
          presenceLecturer: {
            connect: {
              nidk: presenceData.nidk,
            },
          },
          presenceStudent: {
            connect: {
              npm: presenceData.npm,
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Prisma.PresenceCreateInput,
      });

      return PresenceModel.fromEntity(presence).toDTO();
    } catch (error: any) {
      if (
        error.code === "P2005" ||
        (typeof error.message === "string" &&
          error.message.includes("No 'Student' record"))
      ) {
        return "Student with given NPM not found";
      }
      return getErrorMessage(error);
    }
  }

  async update(
    id: number,
    presenceData: UpdatePresenceDto
  ): Promise<PresenceDTO | string> {
    if (!id) {
      return "Presence ID is required for update";
    }
    try {
      const presence = await this.prisma.presence.update({
        where: { id } as Prisma.PresenceWhereUniqueInput,
        data: {
          ...presenceData,
          updatedAt: new Date(),
        },
      });

      return PresenceModel.fromEntity(presence).toDTO();
    } catch (error) {
      return getErrorMessage(error);
    }
  }

  async softDelete(id: number): Promise<PresenceDTO | string> {
    try {
      const presence = await this.prisma.presence.update({
        where: { id } as Prisma.PresenceWhereUniqueInput,
        data: {
          isDeleted: true,
          updatedAt: new Date(),
        } as Prisma.PresenceUpdateInput,
      });

      return PresenceModel.fromEntity(presence).toDTO();
    } catch (error) {
      return getErrorMessage(error);
    }
  }
}

export default PresenceRepository;
