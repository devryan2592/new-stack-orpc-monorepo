import type { Prisma } from "@workspace/db";
import { LeadOutput } from "@workspace/orpc-contract";
import mapCustomerToOutput from "../customers/mapper";

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    customer: {
      include: {
        familyMembersAsOwner: {
          include: {
            member: true;
          };
        };
        associatesAsOwner: {
          include: {
            associate: true;
          };
        };
      };
    };
  };
}>;

const mapLeadToOutput = (lead: LeadWithRelations): LeadOutput => {
  return {
    id: lead.id,
    leadCode: lead.leadCode,
    customerId: lead.customerId,
    assignedToId: lead.assignedToId,
    leadType: lead.leadType,
    leadSource: lead.leadSource,
    status: lead.status,
    priority: lead.priority,

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
    budget: lead.budget,

    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,

    customer: lead.customer ? mapCustomerToOutput(lead.customer) : null,

    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
};

export default mapLeadToOutput;
