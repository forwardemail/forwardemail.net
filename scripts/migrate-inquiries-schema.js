// Simple migration for existing data
async function migrateInquiriesSchema() {
  console.log('Starting simplified inquiries migration...');

  try {
    // Update existing documents with default values
    const result = await Inquiries.updateMany(
      {},
      {
        $set: {
          status: {
            $cond: { if: '$is_resolved', then: 'resolved', else: 'new' }
          },
          priority: 'medium'
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} inquiries`);

    // Create performance indexes
    await Inquiries.collection.createIndex({ status: 1, priority: 1 });
    await Inquiries.collection.createIndex({ assigned_to: 1, status: 1 });

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  }
}
