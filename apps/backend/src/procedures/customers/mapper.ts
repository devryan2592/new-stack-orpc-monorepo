import type { Prisma } from "@workspace/db";
import { CustomerOutputType } from "@workspace/orpc-contract";

export type CustomerWithRelations = Prisma.CustomerGetPayload<{
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
}>;

const mapCustomerToOutput = (
  customer: CustomerWithRelations
): CustomerOutputType => {
  return {
    id: customer.id,
    avatar: customer.avatar,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    alternatePhone: customer.alternatePhone,
    dateOfBirth: customer.dateOfBirth,
    gender: customer.gender,
    nationality: customer.nationality,
    passportNumber: customer.passportNumber,
    passportExpiry: customer.passportExpiry,
    address: customer.address,
    city: customer.city,
    country: customer.country,
    type: customer.type,
    companyName: customer.companyName,
    gstNumber: customer.gstNumber,
    vatNumber: customer.vatNumber,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,

    familyMembers:
      customer.familyMembersAsOwner?.map((r) => ({
        id: r.member.id,
        firstName: r.member.firstName,
        lastName: r.member.lastName,
        avatar: r.member.avatar,
      })) || [],

    associates:
      customer.associatesAsOwner?.map((r) => ({
        id: r.associate.id,
        firstName: r.associate.firstName,
        lastName: r.associate.lastName,
        avatar: r.associate.avatar,
      })) || [],
  };
};

export default mapCustomerToOutput;
