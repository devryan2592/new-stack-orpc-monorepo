import { prisma } from "@workspace/db";
import {
  CreateCustomerInput,
  CustomerOutput,
  ListCustomersInput,
  UpdateCustomerInput,
  DeleteCustomerInput,
  ListCustomersOutput,
} from "./types";
import { ORPCError } from "@orpc/server";
import mapCustomerToOutput from "./mapper";

export const customerServiceFactory = (db: typeof prisma) => {
  // -------------------- Utilities --------------------

  async function replaceFamilyMembers(
    customerId: string,
    memberIds: string[] | undefined,
    tx?: any
  ) {
    const dbInstance = tx || db;

    // Delete existing relations where this customer is the owner
    await dbInstance.familyRelation.deleteMany({
      where: {
        customerId,
      },
    });

    if (memberIds?.length) {
      // Create new relations
      await dbInstance.familyRelation.createMany({
        data: memberIds.map((memberId) => ({
          customerId,
          memberId,
        })),
      });
    }
  }

  async function replaceAssociates(
    customerId: string,
    associateIds: string[] | undefined,
    tx?: any
  ) {
    const dbInstance = tx || db;

    await dbInstance.associateRelation.deleteMany({
      where: {
        customerId,
      },
    });

    if (associateIds?.length) {
      await dbInstance.associateRelation.createMany({
        data: associateIds.map((associateId) => ({
          customerId,
          associateId,
        })),
      });
    }
  }

  // -------------------- CRUD Operations --------------------

  async function createCustomer(
    input: CreateCustomerInput["body"]
  ): Promise<CustomerOutput> {
    const {
      familyMemberIds,
      associateIds,
      dateOfBirth,
      passportExpiry,
      ...rest
    } = input;

    try {
      const createdCustomer = await db.$transaction(async (tx) => {
        const created = await tx.customer.create({
          data: {
            ...rest,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            passportExpiry: passportExpiry ? new Date(passportExpiry) : null,
          },
        });

        if (familyMemberIds) {
          await replaceFamilyMembers(created.id, familyMemberIds, tx);
        }

        if (associateIds) {
          await replaceAssociates(created.id, associateIds, tx);
        }

        return await tx.customer.findUniqueOrThrow({
          where: { id: created.id },
          include: {
            familyMembersAsOwner: { include: { member: true } },
            associatesAsOwner: { include: { associate: true } },
          },
        });
      });

      return { success: true, data: mapCustomerToOutput(createdCustomer) };
    } catch (err: any) {
      const message = err?.message || "Failed to create customer";
      throw new ORPCError("BAD_REQUEST", { message, cause: err });
    }
  }

  async function updateCustomer(
    id: string,
    input: UpdateCustomerInput["body"]
  ): Promise<CustomerOutput> {
    const {
      familyMemberIds,
      associateIds,
      dateOfBirth,
      passportExpiry,
      ...rest
    } = input;

    try {
      const updatedCustomer = await db.$transaction(async (tx) => {
        const existing = await tx.customer.findUnique({ where: { id } });
        if (!existing) {
          throw new ORPCError("NOT_FOUND", { message: "Customer not found" });
        }

        const updateData: any = { ...rest };
        if (dateOfBirth !== undefined) {
          updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
        }
        if (passportExpiry !== undefined) {
          updateData.passportExpiry = passportExpiry
            ? new Date(passportExpiry)
            : null;
        }

        const updated = await tx.customer.update({
          where: { id },
          data: updateData,
        });

        if (familyMemberIds !== undefined) {
          await replaceFamilyMembers(updated.id, familyMemberIds, tx);
        }

        if (associateIds !== undefined) {
          await replaceAssociates(updated.id, associateIds, tx);
        }

        return await tx.customer.findUniqueOrThrow({
          where: { id: updated.id },
          include: {
            familyMembersAsOwner: { include: { member: true } },
            associatesAsOwner: { include: { associate: true } },
          },
        });
      });

      return { success: true, data: mapCustomerToOutput(updatedCustomer) };
    } catch (err: any) {
      if (err instanceof ORPCError) throw err;
      const message = err?.message || "Failed to update customer";
      throw new ORPCError("BAD_REQUEST", { message, cause: err });
    }
  }

  async function getCustomer(id: string): Promise<CustomerOutput> {
    const customer = await db.customer.findUnique({
      where: { id },
      include: {
        familyMembersAsOwner: { include: { member: true } },
        associatesAsOwner: { include: { associate: true } },
      },
    });

    if (!customer) {
      throw new ORPCError("NOT_FOUND", { message: "Customer not found" });
    }

    return { success: true, data: mapCustomerToOutput(customer) };
  }

  async function deleteCustomer(id: string): Promise<{ success: boolean }> {
    const existing = await db.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new ORPCError("NOT_FOUND", { message: "Customer not found" });
    }

    await db.customer.delete({ where: { id } });
    return { success: true };
  }

  async function getAll(
    input: ListCustomersInput["query"]
  ): Promise<ListCustomersOutput> {
    const { page = 1, limit = 10, search } = input;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search?.trim()) {
      where.OR = [
        { firstName: { contains: search.trim(), mode: "insensitive" } },
        { lastName: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
        { phone: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    const [total, customers] = await Promise.all([
      db.customer.count({ where }),
      db.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          familyMembersAsOwner: { include: { member: true } },
          associatesAsOwner: { include: { associate: true } },
        },
      }),
    ]);

    const mappedCustomers = customers.map(mapCustomerToOutput);

    return {
      success: true,
      data: {
        customers: mappedCustomers,
        total,
      },
    };
  }

  return {
    createCustomer,
    updateCustomer,
    getCustomer,
    deleteCustomer,
    getAllCustomers: getAll,
  };
};

export const customerService = customerServiceFactory(prisma);
