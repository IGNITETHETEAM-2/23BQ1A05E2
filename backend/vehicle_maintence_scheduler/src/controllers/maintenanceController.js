// Maintenance Controller - Handles maintenance schedule CRUD

let schedules = []; // Replace with DB model as needed

exports.getAllSchedules = (req, res) => {
  res.status(200).json({ success: true, data: schedules });
};

exports.getScheduleByVehicle = (req, res) => {
  const vehicleSchedules = schedules.filter((s) => s.vehicleId === req.params.vehicleId);
  res.status(200).json({ success: true, data: vehicleSchedules });
};

exports.createSchedule = (req, res) => {
  const { vehicleId, serviceType, scheduledDate, notes } = req.body;
  const schedule = {
    id: Date.now().toString(),
    vehicleId,
    serviceType,
    scheduledDate,
    notes,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  schedules.push(schedule);
  res.status(201).json({ success: true, data: schedule });
};

exports.updateSchedule = (req, res) => {
  const index = schedules.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Schedule not found' });
  schedules[index] = { ...schedules[index], ...req.body };
  res.status(200).json({ success: true, data: schedules[index] });
};

exports.deleteSchedule = (req, res) => {
  schedules = schedules.filter((s) => s.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Schedule deleted' });
};
