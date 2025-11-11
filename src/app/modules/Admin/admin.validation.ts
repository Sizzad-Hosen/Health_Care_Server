import { z } from "zod";

// Zod schema for filtering Admins
const updateAdminValdation = {
  filterAdmin: z.object({
    body: z.object({
      name: z.string().optional(),
      email: z.string().email("Invalid email format").optional(),
      contactNumber: z
        .string()
        .min(5, "Contact number must be at least 5 digits")
        .optional(),
      searchTerm: z.string().optional(),
    }),
  }),
};


export const AdminValidationSchema = {
updateAdminValdation

}