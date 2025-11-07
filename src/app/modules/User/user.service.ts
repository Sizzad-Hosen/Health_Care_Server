

import { UserRole } from "@prisma/client";


import bcrypt from "bcryptjs";
import prisma from "../../../shared/prisma";


const createAdmin = async (data: any) => {
  // Hash the password
  const passwordHash = await bcrypt.hash(data.password, 10);

  const result = await prisma.$transaction(async (tx) => {
  
    const user = await tx.user.create({
      data: {
        email: data.admin.email,
        password: passwordHash,
        role: UserRole.SUPER_ADMIN, 
      },
    });

  
    const admin = await tx.admin.create({
      data: {
        name: data.admin.name,
        contactNumber: data.admin.contactNumber,
        user: {
          connect: { id: user.id }
        }
      },
    });

    return { user, admin };
  });

  return result;
};

export const UserService = {
  createAdmin,
};
