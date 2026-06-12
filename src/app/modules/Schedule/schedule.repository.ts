import { Prisma, Schedule } from "@prisma/client";
import prisma from "../../../shared/prisma";

const findExistingSlot = async (startDate: Date, endDate: Date): Promise<Schedule | null> => {
    return prisma.schedule.findFirst({
        where: {
            AND: [
                { startDate },
                { endDate },
            ],
        },
    });
};

const createSlot = async (startDate: Date, endDate: Date): Promise<Schedule> => {
    return prisma.schedule.create({
        data: {
            startDate,
            endDate,
        },
    });
};

const findDoctorScheduleIdsByDoctorEmail = async (email?: string): Promise<string[]> => {
    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email,
            },
        },
    });

    return doctorSchedules.map((schedule) => schedule.scheduleId);
};

const findMany = async (
    where: Prisma.ScheduleWhereInput,
    skip: number,
    take: number,
    orderBy: Prisma.ScheduleOrderByWithRelationInput
): Promise<Schedule[]> => {
    return prisma.schedule.findMany({
        where,
        skip,
        take,
        orderBy,
    });
};

const count = async (where: Prisma.ScheduleWhereInput): Promise<number> => {
    return prisma.schedule.count({
        where,
    });
};

const findById = async (id: string): Promise<Schedule | null> => {
    return prisma.schedule.findUnique({
        where: {
            id,
        },
    });
};

const updateById = async (id: string, data: Prisma.ScheduleUpdateInput): Promise<Schedule> => {
    return prisma.schedule.update({
        where: {
            id,
        },
        data,
    });
};

const deleteById = async (id: string): Promise<Schedule> => {
    return prisma.schedule.delete({
        where: {
            id,
        },
    });
};

export const ScheduleRepository = {
    findExistingSlot,
    createSlot,
    findDoctorScheduleIdsByDoctorEmail,
    findMany,
    count,
    findById,
    updateById,
    deleteById,
};
