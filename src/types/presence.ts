export type Presence = {
  id: number;
  lecturer: {
    nidk: string;
    name: string;
  }
  student: {
    npm: number;
    name: string;
    clas: string;
    major: string;
  }
  status: boolean;
  course: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePresenceDto = {
  nidk: string;
  nameLecturer: string;
  npm: number;
  nameStudent: string;
  clas: string;
  major: string;
  status: boolean;
  description: string | null;
  course: string;
}

export type UpdatePresenceDto = {
  status?: boolean;
  description?: string;
  course?: string;
}

export interface PresenceFilters {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
