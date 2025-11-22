Important – Do NOT modify the Better Auth User table.
Only relate to it.

model User {
  id        String    @id @default(cuid())
  email     String?   @unique
  // Better Auth fields...
  userRoles UserRole[]
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique
  label       String?
  description String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  rolePerms   RolePermission[]
  userRoles   UserRole[]
}

model Permission {
  id          String           @id @default(cuid())
  name        String           @unique
  label       String?
  description String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  rolePerms   RolePermission[]
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String

  role         Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
}

model UserRole {
  id       String   @id @default(cuid())
  userId   String
  roleId   String

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role     Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
}