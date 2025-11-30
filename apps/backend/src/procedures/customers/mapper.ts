import type { Prisma } from "@workspace/db";
import { CustomerOutputType } from "@workspace/orpc-contract"; // importing directly from source if package export is not set up for deep imports, or use package name if it exports it.
// Better to check how to import. Usually @workspace/orpc-contract should export it.
// The index.ts in orpc-contract exports everything?
// Let's check packages/orpc-contract/src/index.ts.

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

    // Map relations
    // We only map the member details, we might need to recursively map if we want full tree but usually 1 level is enough or we hit infinite loop.
    // The CustomerOutputType defines familyMembers as CustomerOutputType[] which is recursive.
    // To avoid infinite loop/deep nesting issues in mapper, we might want to return a simpler version or just map the basic fields.
    // However, since `familyMembersAsOwner` includes `member` which is a `Customer`, we can map it.
    // But `member` won't have *its* family members loaded (unless we include deep).
    // So we cast it or map it to a base customer output.

    familyMembers:
      customer.familyMembersAsOwner?.map((r) => ({
        ...r.member,
        // Default these to empty/undefined to stop recursion if data isn't loaded
        familyMembers: [],
        associates: [],
      })) || [],

    associates:
      customer.associatesAsOwner?.map((r) => ({
        ...r.associate,
        familyMembers: [],
        associates: [],
      })) || [],
  };
};

export default mapCustomerToOutput;
