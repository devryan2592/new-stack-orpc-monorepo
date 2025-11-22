import { z } from "zod";
import { prisma } from "@workspace/db";
import { AuthInputs, AuthOutputs } from "@workspace/orpc-contract";

export async function createRole(input: z.infer<typeof AuthInputs.roleCreateInput>): Promise<z.infer<typeof AuthOutputs.roleOutput>> {
  const exists = await prisma.role.findUnique({ where: { name: input.name } });
  if (exists) {
    return { status: { code: "CONFLICT", message: "Role name already exists" }, data: undefined };
  }
  const role = await prisma.role.create({ data: input });
  return { status: { code: "OK" }, data: role };
}

export async function updateRole(input: z.infer<typeof AuthInputs.roleUpdateInput>): Promise<z.infer<typeof AuthOutputs.roleOutput>> {
  const role = await prisma.role.findUnique({ where: { id: input.id } });
  if (!role) {
    return { status: { code: "NOT_FOUND", message: "Role not found" }, data: undefined };
  }
  const updated = await prisma.role.update({ where: { id: input.id }, data: { label: input.label, description: input.description } });
  return { status: { code: "OK" }, data: updated };
}

export async function deleteRole(input: z.infer<typeof AuthInputs.roleDeleteInput>): Promise<z.infer<typeof AuthOutputs.emptyOutput>> {
  const role = await prisma.role.findUnique({ where: { id: input.id } });
  if (!role) {
    return { status: { code: "NOT_FOUND", message: "Role not found" } };
  }
  if (role.name === "superadmin") {
    return { status: { code: "FORBIDDEN", message: "Protected role cannot be deleted" } };
  }
  await prisma.role.delete({ where: { id: input.id } });
  return { status: { code: "OK" } };
}

export async function getRole(input: z.infer<typeof AuthInputs.roleGetInput>): Promise<z.infer<typeof AuthOutputs.roleOutput>> {
  const role = await prisma.role.findUnique({ where: { id: input.id } });
  if (!role) return { status: { code: "NOT_FOUND" }, data: undefined };
  return { status: { code: "OK" }, data: role };
}

export async function listRoles(input: z.infer<typeof AuthInputs.roleListInput>): Promise<z.infer<typeof AuthOutputs.roleListOutput>> {
  const total = await prisma.role.count();
  const skip = (input.page - 1) * input.pageSize;
  const data = await prisma.role.findMany({ skip, take: input.pageSize, orderBy: { createdAt: "desc" } });
  return { status: { code: "OK" }, data, meta: { page: input.page, pageSize: input.pageSize, total } };
}