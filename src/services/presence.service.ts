import PresenceRepository from "../repositories/presence.repository";
import PresenceModel from "../models/presence.model";
import {
  Presence as PresenceDTO ,
  CreatePresenceDto,
  UpdatePresenceDto,
  PresenceFilters,
} from "../types/presence";
import { PaginationParams, PaginatedResult } from "../types/pagination";
import { time } from "console";

class PresenceService {
  private presenceRepository: PresenceRepository;

  constructor(presenceRepository: PresenceRepository) {
    this.presenceRepository = presenceRepository;
  }

  async getAllPresences(
    nidk: string,
    pagination?: PaginationParams,
    filters?: PresenceFilters
  ): Promise<PaginatedResult<PresenceDTO > | string> {
    const data = await this.presenceRepository.findAll(
      nidk,
      pagination,
      filters
    );

    if (typeof data === "string") {
      return data;
    }

    const { presences, total } = data;

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 24;
    const lastPage = Math.ceil(total / limit);

    return {
      data: presences,
      meta: {
        total,
        page,
        lastPage,
        hasNextPage: page < lastPage,
        hasPrevPage: page > 1,
      },
    };
  }

  async getPresenceById(
    id: number,
    nidk: string,
  ): Promise<PresenceDTO  | string> {
    const presence = await this.presenceRepository.findById(id, nidk);

    if (typeof presence === "string") {
      return presence;
    }

    if (!presence) {
      return "Presence not found";
    }

    return presence;
  }

  async createPresence(
    presenceData: CreatePresenceDto
  ): Promise<PresenceDTO  | string> {
    if (
      presenceData.npm === undefined ||
      presenceData.status === undefined ||
      presenceData.course === undefined
    ) {
      return "NPM, status, and course are required";
    }

    const result = await this.presenceRepository.create(presenceData);
    if (typeof result === "string") {
      return result;
    }

    return result;
  }

  async updatePresence(
    nidk: string,
    id: number,
    presenceData: UpdatePresenceDto
  ): Promise<PresenceDTO  | string> {
    const existingPresence = await this.presenceRepository.findById(
      id,
      nidk
    );
    if (typeof existingPresence === "string") {
      return existingPresence;
    }

    if (!existingPresence) {
      return "Presence not found";
    }

    const result = await this.presenceRepository.update(id, presenceData);
    if (typeof result === "string") {
      return result;
    }

    return result;
  }

  async softDelete(
    id: number,
    nidk: string
  ): Promise<PresenceDTO  | string> {
    const existingPresence = await this.presenceRepository.findById(
      id,
      nidk
    );
    if (typeof existingPresence === "string") {
      return existingPresence;
    }

    if (!existingPresence) {
      return "Presence not found";
    }

    const result = await this.presenceRepository.softDelete(id);
    if (typeof result === "string") {
      return result;
    }

    return result;
  }
}

export default PresenceService;
