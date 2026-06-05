// Vehicle Controller - Handles CRUD operations for vehicles

let vehicles = []; // Replace with DB model as needed

exports.getAllVehicles = (req, res) => {
  res.status(200).json({ success: true, data: vehicles });
};

exports.getVehicleById = (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.status(200).json({ success: true, data: vehicle });
};

exports.createVehicle = (req, res) => {
  const { make, model, year, licensePlate, ownerId } = req.body;
  const vehicle = { id: Date.now().toString(), make, model, year, licensePlate, ownerId };
  vehicles.push(vehicle);
  res.status(201).json({ success: true, data: vehicle });
};

exports.updateVehicle = (req, res) => {
  const index = vehicles.findIndex((v) => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  vehicles[index] = { ...vehicles[index], ...req.body };
  res.status(200).json({ success: true, data: vehicles[index] });
};

exports.deleteVehicle = (req, res) => {
  vehicles = vehicles.filter((v) => v.id !== req.params.id);
  res.status(200).json({ success: true, message: 'Vehicle deleted' });
};
