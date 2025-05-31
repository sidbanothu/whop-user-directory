import { db } from './index';
import { profiles } from './schema';
import { eq } from 'drizzle-orm';

async function testDatabaseOperations() {
  try {
    console.log('🧪 Testing database operations...');

    // Test insert
    const testProfile = {
      userId: 'test-user-' + Date.now(),
      experienceId: 'test-experience',
      username: 'testuser-' + Date.now(),
      name: 'Test User',
      bio: 'Testing database operations',
    };

    console.log('📝 Testing insert...');
    const [insertedProfile] = await db.insert(profiles).values(testProfile).returning();
    console.log('✅ Insert successful:', insertedProfile);

    // Test query
    console.log('\n🔍 Testing query...');
    const [queriedProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, insertedProfile.id));
    console.log('✅ Query successful:', queriedProfile);

    // Test delete
    console.log('\n🗑️ Testing delete...');
    const [deletedProfile] = await db
      .delete(profiles)
      .where(eq(profiles.id, insertedProfile.id))
      .returning();
    console.log('✅ Delete successful:', deletedProfile);

    console.log('\n✨ All database operations completed successfully!');
  } catch (error) {
    console.error('❌ Database operation test failed:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseOperations(); 