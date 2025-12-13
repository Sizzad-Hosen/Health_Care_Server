import { z } from 'zod';

const create = z.object({
    body: z.object({
        appointmentId: z.string({
            message: 'Appointment Id is required',
        }),
        rating: z.number({
            message: 'Rating is required',
        }),
        comment: z.string({
            message: 'Comment is required',
        })
    }),
});

export const ReviewValidation = {
    create,
};