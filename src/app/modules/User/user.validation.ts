
import { UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        message: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            message: "Name is required!"
        }),
        email: z.string({
            message: "Email is required!"
        }),
        contactNumber: z.string({
            message: "Contact Number is required!"
        })
    })
});




const updateStatus = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})

export const userValidation = {
    createAdmin,
    updateStatus
}