import { type User } from 'better-auth';
import { v4 as uuidv4 } from 'uuid';
import { db, organization, member } from '@workspace/db';

export const afterCreateUser = async (
  user: User,
): Promise<void> => {
  try {
    const userId = user.id;
    
    // Create a new organization
    const [org] = await db.insert(organization)
      .values({
        id: uuidv4(),
        name: 'Personal',
        createdAt: new Date(),
      })
      .returning();

    // Add user as a member with owner role
    await db.insert(member)
      .values({
        id: uuidv4(),
        organizationId: org.id,
        userId: userId,
        role: 'owner',
        createdAt: new Date(),
      });

  } catch (error) {
    throw error;
  }
};
