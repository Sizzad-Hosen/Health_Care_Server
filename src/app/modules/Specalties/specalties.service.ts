import { Specialties } from "@prisma/client";
import { SpecialtiesRepository as defaultRepository } from "./specalties.repository";
import {
    CreateSpecialtyPayload,
    SpecialtiesRepository,
    SpecialtyUploadFile,
    SpecialtyUploader,
} from "./specalties.types";

export const createSpecialtiesService = (
    repository: SpecialtiesRepository = defaultRepository,
    uploadToCloudinary?: SpecialtyUploader
) => {
    const inserIntoDB = async (
        payload: CreateSpecialtyPayload,
        file?: SpecialtyUploadFile,
        uploader: SpecialtyUploader | undefined = uploadToCloudinary
    ): Promise<Specialties> => {
        const data = { ...payload };

        if (file && uploader) {
            const uploadToCloudinaryResult = await uploader(file);
            data.icon = uploadToCloudinaryResult?.secure_url;
        }

        return repository.create(data);
    };

    const getAllFromDB = async (): Promise<Specialties[]> => {
        return repository.findAll();
    };

    const deleteFromDB = async (id: string): Promise<Specialties> => {
        return repository.deleteById(id);
    };

    return {
        inserIntoDB,
        getAllFromDB,
        deleteFromDB,
    };
};

export const SpecialtiesService = createSpecialtiesService();
