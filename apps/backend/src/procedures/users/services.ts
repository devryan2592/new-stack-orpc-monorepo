import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import { auth } from "@/auth";
import {
  CreateUserInput,
  ListUsersInput,
  UpdateMeInput,
  DeleteUserInput,
  UserOutput,
  ListUsersOutput,
} from "./types";

export const usersServiceFactory = (db: typeof prisma) => {
  const ensureAdmin = async (userId: string) => {
    const userRole = await db.userRole.findFirst({
      where: {
        userId,
        role: {
          name: { in: ["superadmin", "admin"] },
        },
      },
    });
    if (!userRole) {
      throw new ORPCError("FORBIDDEN", { message: "Admin access required" });
    }
  };

  async function me(userId: string): Promise<UserOutput> {
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userProfile: true,
      },
    });

    return {
      success: true,
      data: {
        ...user,
        roles: user.userRoles.map((ur) => ur.role),
        phone: user.userProfile?.phone,
        altPhone: user.userProfile?.altPhone,
        bio: user.userProfile?.bio,
        address: user.userProfile?.address,
        facebook: user.userProfile?.facebook,
        instagram: user.userProfile?.instagram,
        twitter: user.userProfile?.twitter,
        linkedin: user.userProfile?.linkedin,
      },
    };
  }

  async function updateMe(
    userId: string,
    input: UpdateMeInput
  ): Promise<UserOutput> {
    const {
      body: {
        name,
        image,
        phone,
        altPhone,
        bio,
        address,
        facebook,
        instagram,
        twitter,
        linkedin,
      },
    } = input;

    const user = await db.user.update({
      where: { id: userId },
      data: {
        name,
        image,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userProfile: true,
      },
    });

    const userProfile = await db.userProfile.upsert({
      where: { userId: userId },
      update: {
        name,
        phone,
        altPhone,
        bio,
        address,
        facebook,
        instagram,
        twitter,
        linkedin,
        avatarUrl: image,
      },
      create: {
        userId: userId,
        name,
        phone,
        altPhone,
        bio,
        address,
        facebook,
        instagram,
        twitter,
        linkedin,
        avatarUrl: image,
      },
    });

    return {
      success: true,
      data: {
        ...user,
        roles: user.userRoles.map((ur) => ur.role),
        phone: userProfile.phone,
        altPhone: userProfile.altPhone,
        bio: userProfile.bio,
        address: userProfile.address,
        facebook: userProfile.facebook,
        instagram: userProfile.instagram,
        twitter: userProfile.twitter,
        linkedin: userProfile.linkedin,
      },
    };
  }

  async function create(
    requesterId: string,
    input: CreateUserInput
  ): Promise<UserOutput> {
    await ensureAdmin(requesterId);
    const { name, email, password } = input.body;

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!response.user) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to create user",
      });
    }

    const user = await db.user.findUniqueOrThrow({
      where: { id: response.user.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userProfile: true,
      },
    });

    return {
      success: true,
      data: {
        ...user,
        roles: user.userRoles.map((ur) => ur.role),
        phone: user.userProfile?.phone,
        altPhone: user.userProfile?.altPhone,
        bio: user.userProfile?.bio,
        address: user.userProfile?.address,
        facebook: user.userProfile?.facebook,
        instagram: user.userProfile?.instagram,
        twitter: user.userProfile?.twitter,
        linkedin: user.userProfile?.linkedin,
      },
    };
  }

  async function list(
    requesterId: string,
    input: ListUsersInput
  ): Promise<ListUsersOutput> {
    await ensureAdmin(requesterId);
    const { page = 1, limit = 10, search } = input.query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          userProfile: true,
        },
      }),
      db.user.count({ where }),
    ]);

    return {
      success: true,
      data: {
        users: users.map((user) => ({
          ...user,
          roles: user.userRoles.map((ur) => ur.role),
          phone: user.userProfile?.phone,
          altPhone: user.userProfile?.altPhone,
          bio: user.userProfile?.bio,
          address: user.userProfile?.address,
          facebook: user.userProfile?.facebook,
          instagram: user.userProfile?.instagram,
          twitter: user.userProfile?.twitter,
          linkedin: user.userProfile?.linkedin,
        })),
        total,
      },
    };
  }

  async function deleteUser(
    requesterId: string,
    input: DeleteUserInput
  ): Promise<{ success: boolean }> {
    await ensureAdmin(requesterId);
    const { id } = input.params;

    if (id === requesterId) {
      throw new ORPCError("BAD_REQUEST", { message: "Cannot delete yourself" });
    }

    const userToDelete = await db.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });

    if (userToDelete?.userRoles.some((ur) => ur.role.name === "superadmin")) {
      throw new ORPCError("FORBIDDEN", {
        message: "Cannot delete superadmin",
      });
    }

    await db.user.delete({ where: { id } });
    return { success: true };
  }

  return {
    me,
    updateMe,
    create,
    list,
    delete: deleteUser,
  };
};

export const usersService = usersServiceFactory(prisma);
