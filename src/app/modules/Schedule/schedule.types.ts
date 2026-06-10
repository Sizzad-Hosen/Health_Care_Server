import { Prisma, Schedule } from "@prisma/client";

export type ScheduleRepository = {
    findExistingSlot(startDate: Date, endDate: Date): Promise<Schedule | null>;
    createSlot(startDate: Date, endDate: Date): Promise<Schedule>;
    findDoctorScheduleIdsByDoctorEmail(email?: string): Promise<string[]>;
    findMany(
        where: Prisma.ScheduleWhereInput,
        skip: number,
        take: number,
        orderBy: Prisma.ScheduleOrderByWithRelationInput
    ): Promise<Schedule[]>;
    count(where: Prisma.ScheduleWhereInput): Promise<number>;
    findById(id: string): Promise<Schedule | null>;
    deleteById(id: string): Promise<Schedule>;
};
