import { prisma } from "@workspace/db";
import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "./types";

export const createCustomer = async (body: CreateCustomerInput["body"]) => {
  const customer = await prisma.customer.create({
    data: body,
  });
  return { success: true, data: customer };
};

export const listCustomers = async (query: ListCustomersInput["query"]) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.customer.count({ where }),
  ]);

  return { success: true, data: { customers, total } };
};

export const getCustomer = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return { success: true, data: customer };
};

export const updateCustomer = async (
  id: string,
  body: UpdateCustomerInput["body"]
) => {
  const customer = await prisma.customer.update({
    where: { id },
    data: body,
  });
  return { success: true, data: customer };
};

export const deleteCustomer = async (id: string) => {
  await prisma.customer.delete({
    where: { id },
  });
  return { success: true };
};
