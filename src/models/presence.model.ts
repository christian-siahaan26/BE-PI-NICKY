import { type Presence as PrismaPresence } from '@prisma/client';

class PresenceModel  {
  private id: number;
  private nidk: string;
  private nameLecturer: string;
  private npm: number;
  private nameStudent: string;
  private clas: string;
  private major: string;
  private status: boolean;
  private description: string | null;
  private course: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(id: number, nidk: string, nameLecturer: string, npm: number, nameStudent: string, clas: string, major: string,  status: boolean, description: string | null, course: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.nidk = nidk
    this.nameLecturer = nameLecturer
    this.npm = npm
    this.nameStudent = nameStudent
    this.clas = clas
    this.major = major
    this.status = status
    this.description = description
    this.course = course
    this.createdAt = createdAt
    this.updatedAt = updatedAt;
  }

  static fromEntity(prismaPresence: PrismaPresence) {
    return new PresenceModel (
        prismaPresence.id,
        prismaPresence.nidk,
        prismaPresence.nameLecturer,
        prismaPresence.npm,
        prismaPresence.nameStudent,
        prismaPresence.clas,
        prismaPresence.major,
        prismaPresence.status,
        prismaPresence.description,
        prismaPresence.course,
        prismaPresence.createdAt,
        prismaPresence.updatedAt
    )
  }

  toDTO() {
    return {
        id: this.id,
        lecturer: {
          nidk: this.nidk,
          name: this.nameLecturer,
        },
        student: {
          npm: this.npm,
          name: this.nameStudent,
          clas: this.clas,
          major: this.major
        },
        status: this.status,
        description: this.description,
        course: this.course,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
  }
}

export default PresenceModel ;
