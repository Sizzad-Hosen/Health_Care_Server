import { Specialties } from "@prisma/client";
import { IFile } from "../../interface/file";

export type CreateSpecialtyPayload = {
    title: string;
    icon?: string;
};

export type SpecialtyUploadFile = IFile | undefined;

export type SpecialtiesRepository = {
    create(data: CreateSpecialtyPayload): Promise<Specialties>;
    findAll(): Promise<Specialties[]>;
    updateById(id: string, data: CreateSpecialtyPayload): Promise<Specialties>;
    deleteById(id: string): Promise<Specialties>;
};

export type SpecialtyUploader = (file: IFile) => Promise<{ secure_url?: string } | undefined>;
