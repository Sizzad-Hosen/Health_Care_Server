import { z } from "zod";

const create = z.object({
    title: z.string({
        message: "Title is required!"
    })
});

const update = z.object({
    title: z.string({
        message: "Title is required!"
    }).min(1, "Title is required!")
});

export const SpecialtiesValidtaion = {
    create,
    update
}
