

import { Admin, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interface/file";
import { fileUploader } from "../../../helpars/fileUploder";

interface CreateAdminRequest extends Request {
    body: {
        admin: {
            name: string;
            contactNumber: string;
            email: string;
            profilePhoto?: string;
            [key: string]: any;
        };
        password: string;
    };
}

const createAdmin = async (req: CreateAdminRequest): Promise<Admin> => {

    const file = req.file as IFile;


    console.log('file', file)

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};

export const UserService = {
  createAdmin,
};
