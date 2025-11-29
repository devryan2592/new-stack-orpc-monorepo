import { prisma } from "@workspace/db";
import {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "./types";

const customerInclude = {
  familyMembersAsOwner: { include: { member: true } },
  familyMembersAsMember: { include: { customer: true } },
  associatesAsOwner: { include: { associate: true } },
  associatesAsMember: { include: { customer: true } },
};

const mapCustomer = (customer: any) => {
  const familyMembers = [
    ...(customer.familyMembersAsOwner?.map((r: any) => r.member) || []),
    ...(customer.familyMembersAsMember?.map((r: any) => r.customer) || []),
  ];
  const associates = [
    ...(customer.associatesAsOwner?.map((r: any) => r.associate) || []),
    ...(customer.associatesAsMember?.map((r: any) => r.customer) || []),
  ];

  // Deduplicate by ID
  const uniqueFamily = Array.from(
    new Map(familyMembers.map((item: any) => [item.id, item])).values()
  );
  const uniqueAssociates = Array.from(
    new Map(associates.map((item: any) => [item.id, item])).values()
  );

  const {
    familyMembersAsOwner,
    familyMembersAsMember,
    associatesAsOwner,
    associatesAsMember,
    ...rest
  } = customer;

  return {
    ...rest,
    familyMembers: uniqueFamily,
    associates: uniqueAssociates,
  };
};

export const createCustomer = async (body: CreateCustomerInput["body"]) => {
  const { familyMemberIds, associateIds, ...rest } = body;

  const customer = await prisma.customer.create({
    data: {
      ...rest,
      familyMembersAsOwner: familyMemberIds
        ? {
            create: familyMemberIds.map((id) => ({ memberId: id })),
          }
        : undefined,
      associatesAsOwner: associateIds
        ? {
            create: associateIds.map((id) => ({ associateId: id })),
          }
        : undefined,
    },
    include: customerInclude,
  });
  return { success: true, data: mapCustomer(customer) };
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
      include: customerInclude,
    }),
    prisma.customer.count({ where }),
  ]);

  return {
    success: true,
    data: { customers: customers.map(mapCustomer), total },
  };
};

export const getCustomer = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: customerInclude,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return { success: true, data: mapCustomer(customer) };
};

export const updateCustomer = async (
  id: string,
  body: UpdateCustomerInput["body"]
) => {
  const { familyMemberIds, associateIds, ...rest } = body;

  const updateData: any = { ...rest };

  if (familyMemberIds !== undefined) {
    await prisma.familyRelation.deleteMany({
      where: { customerId: id },
    });
    updateData.familyMembersAsOwner = {
      create: familyMemberIds.map((mid) => ({ memberId: mid })),
    };
  }

  if (associateIds !== undefined) {
    await prisma.associateRelation.deleteMany({
      where: { customerId: id },
    });
    updateData.associatesAsOwner = {
      create: associateIds.map((aid) => ({ associateId: aid })),
    };
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: updateData,
    include: customerInclude,
  });
  return { success: true, data: mapCustomer(customer) };
};

export const deleteCustomer = async (id: string) => {
  await prisma.customer.delete({
    where: { id },
  });
  return { success: true };
};
