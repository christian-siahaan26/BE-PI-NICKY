import { type Lecturer as PrismaLecturer } from "@prisma/client";

export default class LecturerModel {
  private nidk: string;
  private name: string;

  constructor(nidk: string, name: string) {
    this.nidk = nidk;
    this.name = name;
  }

  fromEntity(PrismaLecturer: PrismaLecturer) {
    return new LecturerModel(PrismaLecturer.nidk, PrismaLecturer.name);
  }

  toDTO() {
    return {
      nidk: this.nidk,
      name: this.name,
    };
  }
}
