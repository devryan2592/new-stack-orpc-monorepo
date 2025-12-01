import type { Prisma } from "@workspace/db";
import {
  LeadOutputType,
  LeadNoteOutputType,
  LeadLogOutputType,
  LeadTaskOutputType,
} from "@workspace/orpc-contract";
import mapCustomerToOutput from "../customers/mapper";

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    customer: {
      include: {
        familyMembersAsOwner: { include: { member: true } };
        associatesAsOwner: { include: { associate: true } };
      };
    };
  };
}>;

export type LeadNoteWithRelations = Prisma.LeadNoteGetPayload<{}>;
export type LeadLogWithRelations = Prisma.LeadLogGetPayload<{}>;
export type LeadTaskWithRelations = Prisma.LeadTaskGetPayload<{}>;

export const mapLeadToOutput = (lead: LeadWithRelations): LeadOutputType => {
  return {
    id: lead.id,
    leadCode: lead.leadCode,
    customerId: lead.customerId,
    assignedToId: lead.assignedToId,
    leadType: lead.leadType as any,
    leadSource: lead.leadSource as any,
    status: lead.status as any,
    priority: lead.priority as any,
    travelFrom: lead.travelFrom,
    travelTo: lead.travelTo,
    travelStart: lead.travelStart,
    travelEnd: lead.travelEnd,
    numberOfDays: lead.numberOfDays,
    numberOfAdults: lead.numberOfAdults,
    numberOfChildren: lead.numberOfChildren,
    numberOfInfants: lead.numberOfInfants,
    tags: lead.tags,
    destinations: lead.destinations,
    cities: lead.cities,
    companyName: lead.companyName,
    whatsappNumber: lead.whatsappNumber,
    requirements: lead.requirements,
    budget: lead.budget ? Number(lead.budget) : null,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    customer: lead.customer ? mapCustomerToOutput(lead.customer) : null,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

export const mapLeadNoteToOutput = (note: LeadNoteWithRelations): LeadNoteOutputType => {
  return {
    id: note.id,
    leadId: note.leadId,
    content: note.content,
    createdBy: note.createdBy,
    createdAt: note.createdAt,
  };
};

export const mapLeadLogToOutput = (log: LeadLogWithRelations): LeadLogOutputType => {
  return {
    id: log.id,
    leadId: log.leadId,
    type: log.type as any,
    message: log.message,
    nextAction: log.nextAction,
    loggedBy: log.loggedBy,
    createdAt: log.createdAt,
  };
};

export const mapLeadTaskToOutput = (task: LeadTaskWithRelations): LeadTaskOutputType => {
  return {
    id: task.id,
    leadId: task.leadId,
    title: task.title,
    dueDate: task.dueDate,
    status: task.status as any,
    assignedTo: task.assignedTo,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};
