import { PrismaClient, OrganizationRole, User } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Lookup a user within an organization ensuring they have one of the allowed roles.
 */
export async function getUserForOrganization(
  userId: string,
  organizationId: string,
  allowedRoles: OrganizationRole[]
): Promise<User | null> {
  const membership = await prisma.userOrganization.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    include: { user: true },
  });

  if (!membership) return null;
  if (!allowedRoles.includes(membership.role)) return null;
  return membership.user;
}
