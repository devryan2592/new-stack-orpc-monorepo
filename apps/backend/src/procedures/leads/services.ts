import { prisma } from "@workspace/db";
import { CreateLeadInput, ListLeadsInput, UpdateLeadInput } from "./types";

export const createLead = async (body: CreateLeadInput["body"]) => {
  const leadCode = `LEAD-${Date.now()}`;
  const { customerId, ...leadData } = body;

  const data: any = {
    ...leadData,
    leadCode,
  };

  if (customerId) {
    data.customerId = customerId;
  }

  const lead = await prisma.lead.create({
    data,
    include: {
      customer: true,
    },
  });
  return { success: true, data: lead };
};

export const listLeads = async (query: ListLeadsInput["query"]) => {
  const { page = 1, limit = 10, search, status, customerId } = query;
  const skip = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.OR = [
      { leadCode: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (customerId) {
    where.customerId = customerId;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { success: true, data: { leads, total } };
};

export const getLead = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      customer: true,
    },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  return { success: true, data: lead };
};

export const updateLead = async (id: string, body: UpdateLeadInput["body"]) => {
  const lead = await prisma.lead.update({
    where: { id },
    data: body,
    include: {
      customer: true,
    },
  });
  return { success: true, data: lead };
};

export const deleteLead = async (id: string) => {
  await prisma.lead.delete({
    where: { id },
  });
  return { success: true };
};

export const convertLead = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  if (lead.customerId) {
    throw new Error("Lead is already linked to a customer");
  }

  if (!lead.firstName || !lead.lastName) {
    throw new Error("Lead must have first name and last name to convert");
  }

  const customer = await prisma.customer.create({
    data: {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      type: "INDIVIDUAL",
    },
  });

  await prisma.lead.update({
    where: { id },
    data: {
      customerId: customer.id,
      status: "CONVERTED",
    },
  });

  return { success: true, data: customer };
};
