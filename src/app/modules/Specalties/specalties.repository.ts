import { Prisma, Specialties } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { CreateSpecialtyPayload } from "./specalties.types";

const create = async (data: CreateSpecialtyPayload): Promise<Specialties> => {
    return prisma.specialties.create({
        data: data as Prisma.SpecialtiesCreateInput,
    });
};

const findAll = async (): Promise<Specialties[]> => {
    return prisma.specialties.findMany();
};

const updateById = async (id: string, data: CreateSpecialtyPayload): Promise<Specialties> => {
    return prisma.specialties.update({
        where: {
            id,
        },
        data: data as Prisma.SpecialtiesUpdateInput,
    });
};

const deleteById = async (id: string): Promise<Specialties> => {
    return prisma.specialties.delete({
        where: {
            id,
        },
    });
};

export const SpecialtiesRepository = {
    create,
    findAll,
    updateById,
    deleteById,
};
