import { z } from 'zod';

const create = z.object({
    body: z.object({
        email: z.string({
            message: 'Email is required',
        }),
        name: z.string({
            message: 'Name is required',
        }),
        profilePhoto: z.string({
            message: 'Profile Photo is required',
        }),
        contactNumber: z.string({
            message: 'Contact Number is required',
        }),
        registrationNumber: z.string({
            message: 'Registration Number is required',
        }),
        experience: z.number({
            message: 'Experience is required',
        }),
        gender: z.string({
            message: 'Gender is required',
        }),
        apointmentFee: z.number({
            message: 'Blood group is required',
        }),
        qualification: z.string({
            message: 'Apointment Fee is required',
        }),
        currentWorkingPlace: z.string({
            message: 'Current Working Place is required',
        }),
        designation: z.string({
            message: 'Designation is required',
        }),
    }),
});

const update = z.object({
    body: z.object({
        name: z.string().optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().optional(),
        registrationNumber: z.string().optional(),
        experience: z.number().optional(),
        gender: z.string().optional(),
        apointmentFee: z.number().optional(),
        qualification: z.string().optional(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string().optional(),
    }),
});

export const DoctorValidation = {
    create,
    update,
};
