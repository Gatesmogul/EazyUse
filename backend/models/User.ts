import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "professional" | "admin";
  walletBalance: number;
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUserWallet = async (id: string, amount: number) => {
  return prisma.user.update({
    where: { id },
    data: { walletBalance: amount },
  });
};
