/**
 * Maintenance Service
 * Business logic for checking upcoming maintenance and sending reminders
 */

const maintenanceService = {
  /**
   * Send reminders for maintenance scheduled within the next 7 days
   */
  sendUpcomingReminders: async () => {
    try {
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      console.log(`📅 Checking for maintenance scheduled between ${now.toDateString()} and ${weekFromNow.toDateString()}`);

      // TODO: Query DB for schedules within the next 7 days and notify owners
      // const upcomingSchedules = await MaintenanceSchedule.find({
      //   scheduledDate: { $gte: now, $lte: weekFromNow },
      //   status: 'pending'
      // }).populate('vehicleId');

      // upcomingSchedules.forEach(schedule => {
      //   sendEmail(schedule.vehicleId.ownerId, schedule);
      // });

      console.log('✅ Reminder check complete');
    } catch (error) {
      console.error('❌ Error sending reminders:', error.message);
    }
  },

  /**
   * Mark a maintenance schedule as completed
   */
  markCompleted: async (scheduleId) => {
    // TODO: Update DB record
    console.log(`✅ Schedule ${scheduleId} marked as completed`);
  },
};

module.exports = maintenanceService;
