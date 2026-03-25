import prisma from "../config/db";

export const getUsers = async () => {
  return await prisma.user.findMany({
    select: {  
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true
      
    },
    orderBy: {
      createdAt: 'desc' 
    }
  });
};

export const deleteUserById = async (id: string) => {
  return await prisma.user.delete({
    where: { id }
  });
};

export const updateUserRole = async (id: string, isAdmin: boolean) => {
  return await prisma.user.update({
    where: { id },
    data: { isAdmin }
  });
};