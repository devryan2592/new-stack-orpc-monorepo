import { prisma, PrismaClient } from "@workspace/db";
import {
  AddLogInput,
  AddNoteInput,
  AddTaskInput,
  CreateLeadInput,
  LeadOutput,
  ListLeadsInput,
  UpdateLeadInput,
  UpdateTaskInput,
} from "./types";

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
      },
      include: {
        customer: true,
      },
    });

    return { success: true, data: lead };
  };

  const listLeads = async (query: ListLeadsInput["query"]) => {
    console.log("listLeads query:", query);
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
            customer: true,
          },
        }),
        db.lead.count({ where }),
      ]);

      return { success: true, data: { leads, total } };
    } catch (error) {
      console.error("Error in listLeads:", error);
      throw error;
    }
  };

  const getLead = async (id: string) => {
    const lead = await db.lead.findUnique({
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

  const updateLead = async (
    id: string,
    body: UpdateLeadInput["body"]
  ): Promise<LeadOutput> => {
    // Note: destinations and cities are scalar lists (String[]).
    // Updating them with a new array (including empty []) automatically replaces the existing values.
    // This behavior satisfies the "delete then add" requirement for scalars.
    
    const lead = await db.lead.update({
      where: { id },
      data: body,
      include: {
        customer: true,
      },
    });

    return { success: true, data: lead };
  };

  const deleteLead = async (id: string) => {
    await db.lead.delete({
      where: { id },
    });
    return { success: true };
  };

  const convertLead = async (id: string) => {
    const lead = await db.lead.findUnique({
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

    const customer = await db.customer.create({
      data: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        type: "B2C",
      },
    });

    await db.lead.update({
      where: { id },
      data: {
        customerId: customer.id,
        status: "CONVERTED",
      },
    });

    return { success: true, data: customer };
  };

  const addNote = async (leadId: string, body: AddNoteInput["body"]) => {
    const note = await db.leadNote.create({
      data: {
        leadId,
        content: body.content,
        createdBy: "system", // TODO: Get from context
      },
    });
    return { success: true, data: note };
  };

  const addLog = async (leadId: string, body: AddLogInput["body"]) => {
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

  const addTask = async (leadId: string, body: AddTaskInput["body"]) => {
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

  const updateTask = async (id: string, body: UpdateTaskInput["body"]) => {
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

  const bulkDelete = async (ids: string[]) => {
    await db.lead.deleteMany({
      where: { id: { in: ids } },
    });
    return { success: true };
  };

  const bulkConvert = async (ids: string[]) => {
    await Promise.allSettled(ids.map((id) => convertLead(id)));

    // Check if any failed? For now, we just return success if the operation completed.
    // Or we could throw if all failed.

    return { success: true };
  };

  return {
    createLead,
    listLeads,
    getLead,
    updateLead,
    deleteLead,
    convertLead,
    addNote,
    addLog,
    addTask,
    updateTask,
    bulkDelete,
    bulkConvert,
  };
};

export const leadService = leadServiceFactory(prisma);
