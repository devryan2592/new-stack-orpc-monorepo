import { prisma, PrismaClient } from "@workspace/db";
import {
  CreateLeadInput,
  LeadOutput,
  ListLeadsInput,
  UpdateLeadInput,
  CreateLeadLogInput,
  CreateLeadNoteInput,
  CreateLeadTaskInput,
  UpdateLeadTaskInput,
  LeadLogOutput,
  LeadNoteOutput,
  LeadTaskOutput,
  BulkDeleteInput,
  BulkConvertInput,
} from "./types";
import { ORPCError } from "@orpc/server";
import mapLeadToOutput from "./mapper";
import mapCustomerToOutput from "../customers/mapper";

const leadServiceFactory = (db: PrismaClient) => {
  const createLead = async (
    body: CreateLeadInput["body"]
  ): Promise<LeadOutput> => {
    const {
      customerId,
      leadSource,
      leadType,
      status,
      priority,
      tags,
      travelStart,
      travelEnd,
      ...leadData
    } = body;

    // Create Unique Lead Code
    const leadCode = `Lead-${Date.now()}`;

    const leadStatus = status || "NEW";
    const leadPriority = priority || "LOW";

    const lead = await db.lead.create({
      data: {
        ...leadData,
        leadCode,
        customerId,
        leadSource,
        leadType,
        status: leadStatus,
        priority: leadPriority,
        tags: tags || [],
        travelStart: travelStart ? new Date(travelStart) : null,
        travelEnd: travelEnd ? new Date(travelEnd) : null,
      },
      include: {
        customer: {
          include: {
            familyMembersAsOwner: { include: { member: true } },
            associatesAsOwner: { include: { associate: true } },
          },
        },
      },
    });

    return { success: true, data: mapLeadToOutput(lead) };
  };

  const listLeads = async (query: ListLeadsInput["query"]) => {
    try {
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
        db.lead.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            customer: {
              include: {
                familyMembersAsOwner: { include: { member: true } },
                associatesAsOwner: { include: { associate: true } },
              },
            },
          },
        }),
        db.lead.count({ where }),
      ]);

      return {
        success: true,
        data: { leads: leads.map(mapLeadToOutput), total },
      };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error.message,
        cause: error,
      });
    }
  };

  const getLeadById = async (id: string): Promise<LeadOutput> => {
    const lead = await db.lead.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            familyMembersAsOwner: { include: { member: true } },
            associatesAsOwner: { include: { associate: true } },
          },
        },
      },
    });

    if (!lead) {
      throw new ORPCError("NOT_FOUND", { message: "Lead not found" });
    }

    return { success: true, data: mapLeadToOutput(lead) };
  };

  const updateLead = async (
    id: string,
    body: UpdateLeadInput["body"]
  ): Promise<LeadOutput> => {
    // Note: destinations and cities are scalar lists (String[]).
    // Updating them with a new array (including empty []) automatically replaces the existing values.
    // This behavior satisfies the "delete then add" requirement for scalars.

    const { travelStart, travelEnd, ...rest } = body;

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...rest,
        travelStart: travelStart ? new Date(travelStart) : undefined,
        travelEnd: travelEnd ? new Date(travelEnd) : undefined,
      },
      include: {
        customer: {
          include: {
            familyMembersAsOwner: { include: { member: true } },
            associatesAsOwner: { include: { associate: true } },
          },
        },
      },
    });

    return { success: true, data: mapLeadToOutput(lead) };
  };

  const deleteLead = async (id: string) => {
    await db.lead.delete({
      where: { id },
    });
    return { success: true };
  };

  const convertLeadToCustomer = async (id: string) => {
    const lead = await db.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new ORPCError("NOT_FOUND", { message: "Lead not found" });
    }

    if (lead.customerId) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Lead is already linked to a customer",
      });
    }

    if (!lead.firstName || !lead.lastName) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Lead must have first name and last name to convert",
      });
    }

    const customer = await db.customer.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        type: "B2C",
      },
      include: {
        familyMembersAsOwner: { include: { member: true } },
        associatesAsOwner: { include: { associate: true } },
      },
    });

    await db.lead.update({
      where: { id },
      data: {
        customerId: customer.id,
        status: "CONVERTED",
      },
    });

    return { success: true, data: mapCustomerToOutput(customer) };
  };

  const addLeadNote = async (
    leadId: string,
    body: CreateLeadNoteInput["body"]
  ): Promise<LeadNoteOutput> => {
    const note = await db.leadNote.create({
      data: {
        leadId,
        content: body.content,
        createdBy: "system", // TODO: Get from context
      },
    });
    return { success: true, data: note };
  };

  const updateLeadNote = async (
    id: string,
    body: { content?: string } // Using partial input manually or from types if available
  ): Promise<LeadNoteOutput> => {
    const note = await db.leadNote.update({
      where: { id },
      data: body,
    });
    return { success: true, data: note };
  };

  const addLeadLog = async (
    leadId: string,
    body: CreateLeadLogInput["body"]
  ): Promise<LeadLogOutput> => {
    const log = await db.leadLog.create({
      data: {
        leadId,
        type: body.type,
        message: body.message,
        nextAction: body.nextAction ? new Date(body.nextAction) : null,
        loggedBy: "system", // TODO: Get from context
      },
    });
    return { success: true, data: log };
  };

  const updateLeadLog = async (
    id: string,
    body: {
      type?: any;
      message?: string;
      nextAction?: string;
    }
  ): Promise<LeadLogOutput> => {
    const log = await db.leadLog.update({
      where: { id },
      data: {
        ...body,
        nextAction: body.nextAction ? new Date(body.nextAction) : undefined,
      },
    });
    return { success: true, data: log };
  };

  const addLeadTask = async (
    leadId: string,
    body: CreateLeadTaskInput["body"]
  ): Promise<LeadTaskOutput> => {
    const task = await db.leadTask.create({
      data: {
        leadId,
        title: body.title,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedTo: body.assignedTo,
      },
    });
    return { success: true, data: task };
  };

  const updateLeadTask = async (
    id: string,
    body: UpdateLeadTaskInput["body"]
  ): Promise<LeadTaskOutput> => {
    const task = await db.leadTask.update({
      where: { id },
      data: {
        title: body.title,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        status: body.status,
        assignedTo: body.assignedTo,
      },
    });
    return { success: true, data: task };
  };

  const bulkDeleteLeads = async (body: BulkDeleteInput["body"]) => {
    await db.lead.deleteMany({
      where: { id: { in: body.ids } },
    });
    return { success: true };
  };

  const bulkConvertLeads = async (body: BulkConvertInput["body"]) => {
    await Promise.allSettled(body.ids.map((id) => convertLeadToCustomer(id)));
    return { success: true };
  };

  return {
    createLead,
    listLeads,
    getLeadById,
    updateLead,
    deleteLead,
    convertLeadToCustomer,
    addLeadNote,
    updateLeadNote,
    addLeadLog,
    updateLeadLog,
    addLeadTask,
    updateLeadTask,
    bulkDeleteLeads,
    bulkConvertLeads,
  };
};

export const leadService = leadServiceFactory(prisma);
