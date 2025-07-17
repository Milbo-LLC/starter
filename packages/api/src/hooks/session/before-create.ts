import { type Session } from 'better-auth';
import { db } from '@nimbus/db';
import { member } from '@nimbus/db/src/schema/auth.schema';
import { eq } from 'drizzle-orm';

interface ExtendedSession extends Session {
  activeOrganizationId?: string;
}

async function getActiveOrganization(userId: string) {
  const [membership] = await db.select()
    .from(member)
    .where(eq(member.userId, userId))
    .limit(1);
  
  if (!membership) {
    throw new Error('No organization found for user');
  }
  
  return { id: membership.organizationId };
}

export const beforeCreateSession = async (
  session: Session,
): Promise<{ data: ExtendedSession }> => {
  try {
    const organization = await getActiveOrganization(session.userId);
    return {
      data: {
        ...session,
        activeOrganizationId: organization.id
      }
    }
  } catch (error) {
    throw error;
  }
};
