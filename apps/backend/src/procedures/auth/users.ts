import { privateProcedure } from "@/config/orpc";
import { prisma } from "@workspace/db";
import { ORPCError } from "@orpc/server";
import { auth } from "@/auth";

const ensureAdmin = async (userId: string) => {
  const userRole = await prisma.userRole.findFirst({
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

const me = privateProcedure.users.me.handler(async ({ context }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: context.user.id },
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
    ...user,
    roles: user.userRoles.map((ur) => ur.role),
    // Flatten userProfile fields
    phone: user.userProfile?.phone,
    altPhone: user.userProfile?.altPhone,
    bio: user.userProfile?.bio,
    address: user.userProfile?.address,
    facebook: user.userProfile?.facebook,
    instagram: user.userProfile?.instagram,
    twitter: user.userProfile?.twitter,
    linkedin: user.userProfile?.linkedin,
    // Use avatarUrl from profile if image is missing on user, or prefer one?
    // User.image is usually from OAuth provider. UserProfile.avatarUrl is custom upload.
    // Let's prefer UserProfile.avatarUrl if present, else User.image.
    // But for now, let's just return what we have.
    // The form uses `image` field.
  };
});

const updateMe = privateProcedure.users.updateMe.handler(
  async ({ input, context }) => {
    const {
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
    } = input.body;

    // Update User
    const user = await prisma.user.update({
      where: { id: context.user.id },
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

    // Also update UserProfile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: context.user.id },
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
        userId: context.user.id,
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
    };
  }
);

const createUser = privateProcedure.users.create.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    const { name, email, password } = input.body;

    // Create user using Better Auth API
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

    // Return the created user (fetched from DB to get full fields)
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: response.user.id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      ...user,
      roles: user.userRoles.map((ur) => ur.role),
    };
  }
);

const listUsers = privateProcedure.users.list.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
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
      prisma.user.findMany({
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
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((user) => ({
        ...user,
        roles: user.userRoles.map((ur) => ur.role),
      })),
      total,
    };
  }
);

const deleteUser = privateProcedure.users.delete.handler(
  async ({ input, context }) => {
    await ensureAdmin(context.user.id);
    const { id } = input.params;

    // Prevent deleting self
    if (id === context.user.id) {
      throw new ORPCError("BAD_REQUEST", { message: "Cannot delete yourself" });
    }

    // Prevent deleting superadmin
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: true } } },
    });

    if (userToDelete?.userRoles.some((ur) => ur.role.name === "superadmin")) {
      throw new ORPCError("FORBIDDEN", {
        message: "Cannot delete superadmin",
      });
    }

    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await prisma.user.delete({ where: { id } });

    return { success: true };
  }
);

export const usersRouter = {
  me,
  updateMe,
  create: createUser,
  list: listUsers,
  delete: deleteUser,
};
