import mongoose from 'mongoose';
import Activity from './src/models/Activity.js';
import ExamDivisionMember from './src/models/ExamDivisionMember.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixActivities() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/uniresult';
    await mongoose.connect(mongoURI);

    console.log('✅ Connected to database');

    // Get all exam division members
    const examMembers = await ExamDivisionMember.find({});
    console.log('📋 Found', examMembers.length, 'exam division members');

    let fixed = 0;
    let alreadyCorrect = 0;

    // Fix activities that have an exam division member as performedBy but wrong/missing performedByRole
    for (const member of examMembers) {
      const result = await Activity.updateMany(
        {
          performedBy: member._id,
          performedByRole: { $ne: 'examDiv' }
        },
        {
          $set: {
            performedByRole: 'examDiv',
            performedByName: `${member.firstName} ${member.lastName}`,
            performedByUsername: member.username,
            performedByEmail: member.email
          }
        }
      );
      fixed += result.modifiedCount;
      if (result.modifiedCount > 0) {
        console.log(`✓ Fixed ${result.modifiedCount} activities for ${member.firstName} ${member.lastName}`);
      }
    }

    // Fix activities with null performedBy but have exam division member email
    const activitiesWithNullPerformedBy = await Activity.find({
      performedBy: null,
      performedByEmail: { $exists: true }
    });

    console.log('🔍 Found', activitiesWithNullPerformedBy.length, 'activities with null performedBy');

    for (const activity of activitiesWithNullPerformedBy) {
      const examMember = await ExamDivisionMember.findOne({ email: activity.performedByEmail });
      if (examMember) {
        activity.performedBy = examMember._id;
        activity.performedByRole = 'examDiv';
        activity.performedByName = `${examMember.firstName} ${examMember.lastName}`;
        activity.performedByUsername = examMember.username;
        await activity.save();
        fixed++;
        console.log(`✓ Fixed activity ${activity.activityType} for ${activity.performedByEmail}`);
      }
    }

    console.log('\n✅ Migration complete!');
    console.log('🔧 Fixed:', fixed, 'activities');
    console.log('✓ Already correct:', alreadyCorrect, 'activities');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

fixActivities();