import { z } from "zod";

const create = z.object({
    title: z.string({
        message: "Title is required!"
    })
});

export const SpecialtiesValidtaion = {
    create
}