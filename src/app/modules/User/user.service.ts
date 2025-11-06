import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();



const createAdmin = async (data: any) => {
  const userData = {
    email: data.admin.email,
    password: data.admin.password, 
    role: UserRole.ADMIN
  };

  const result = await prisma.$transaction(async (tx:any) => {
    
    const user = await tx.user.create({
      data: userData
    });

    // Create admin linked to user
    const admin = await tx.admin.create({
      data: {
        ...data.admin,
      }
    });

    return admin;
  });

  return result;
};

export const UserService = {
  createAdmin
};
