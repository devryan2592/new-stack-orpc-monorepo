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

  async function replaceDocuments(
    customerId: string,
    documentIds: string[] | undefined,
    tx?: any
  ) {
    const dbInstance = tx || db;

    await dbInstance.customerDocument.deleteMany({
      where: {
        customerId,
      },
    });

    if (documentIds?.length) {
      await dbInstance.customerDocument.createMany({
        data: documentIds.map((fileId) => ({
          customerId,
          fileId,
        })),
      });
    }
  }

  async function updateLeads(
    customerId: string,
    leadIds: string[] | undefined,
    tx?: any
  ) {
    const dbInstance = tx || db;

    if (leadIds !== undefined) {
      // Unlink all leads currently linked to this customer?
      // Or just link the new ones?
      // Usually "replace" logic implies unlinking others.
      // But leads might be independent.
      // If we want to "set" the leads for this customer, we should unset others?
      // But leads are one-to-many.
      // Let's assume we just update the provided leads to point to this customer.
      // And maybe unset leads that are NOT in the list but were previously?
      // That's complex.
      // Let's just update the provided leads.
      // The user said "relationships for inputs we will only have array of strings".
      // If I send an empty array, does it mean clear all leads?
      // Let's assume yes for consistency with other relations.

      // First, unset customerId for all leads of this customer
      await dbInstance.lead.updateMany({
        where: { customerId },
        data: { customerId: null },
      });

      // Then set customerId for the new leads
      if (leadIds.length > 0) {
        await dbInstance.lead.updateMany({
          where: { id: { in: leadIds } },
          data: { customerId },
        });
      }
    }
  }

  // -------------------- CRUD Operations --------------------

  async function createCustomer(
    input: CreateCustomerInput["body"]
  ): Promise<CustomerOutput> {
    const {
      familyMemberIds,
      associateIds,
      leadIds,
      documentIds,
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

        if (documentIds) {
          await replaceDocuments(created.id, documentIds, tx);
        }

        if (leadIds) {
          await updateLeads(created.id, leadIds, tx);
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
      leadIds,
      documentIds,
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

        if (documentIds !== undefined) {
          await replaceDocuments(updated.id, documentIds, tx);
        }

        if (leadIds !== undefined) {
          await updateLeads(updated.id, leadIds, tx);
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
