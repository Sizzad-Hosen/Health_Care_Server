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
        const data: CreateSpecialtyPayload = { ...payload, icon: payload.icon ?? "" };

        if (file && uploader) {
            try {
                const uploadToCloudinaryResult = await uploader(file);
                data.icon = uploadToCloudinaryResult?.secure_url ?? "";
            } catch {
                data.icon = "";
            }
        }

        return repository.create(data);
    };

    const getAllFromDB = async (): Promise<Specialties[]> => {
        return repository.findAll();
    };

    const updateIntoDB = async (
        id: string,
        payload: CreateSpecialtyPayload,
        file?: SpecialtyUploadFile,
        uploader: SpecialtyUploader | undefined = uploadToCloudinary
    ): Promise<Specialties> => {
        const data: CreateSpecialtyPayload = { ...payload };

        if (file && uploader) {
            try {
                const uploadToCloudinaryResult = await uploader(file);
                if (uploadToCloudinaryResult?.secure_url) {
                    data.icon = uploadToCloudinaryResult.secure_url;
                }
            } catch {
                delete data.icon;
            }
        }

        return repository.updateById(id, data);
    };

    const deleteFromDB = async (id: string): Promise<Specialties> => {
        return repository.deleteById(id);
    };

    return {
        inserIntoDB,
        getAllFromDB,
        updateIntoDB,
        deleteFromDB,
    };
};

export const SpecialtiesService = createSpecialtiesService();
