const { Ambulance, AmbulanceTrip, Patient } = require('../models');

exports.getFleet = async (req, res, next) => {
  try {
    const fleet = await Ambulance.findAll({
      where: { is_active: true }
    });
    res.status(200).json({ success: true, data: fleet });
  } catch (error) {
    next(error);
  }
};

exports.updateAmbulanceStatus = async (req, res, next) => {
  try {
    const amb = await Ambulance.findByPk(req.params.id);
    if (!amb) return res.status(404).json({ success: false, message: 'Ambulance not found' });

    amb.status = req.body.status || amb.status;
    amb.current_location = req.body.location || amb.current_location;
    await amb.save();

    res.status(200).json({ success: true, data: amb });
  } catch (error) {
    next(error);
  }
};

exports.dispatchAmbulance = async (req, res, next) => {
  try {
    const { ambulance_id, pickup_location, patient_info } = req.body;
    
    const amb = await Ambulance.findByPk(ambulance_id);
    if (!amb || amb.status !== 'available') {
        return res.status(400).json({ success: false, message: 'Ambulance not available' });
    }

    const trip = await AmbulanceTrip.create({
      ambulance_id,
      pickup_location,
      patient_info,
      dispatched_by: req.user.id,
      status: 'dispatched'
    });

    amb.status = 'on_trip';
    await amb.save();

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

exports.getTrips = async (req, res, next) => {
  try {
    const trips = await AmbulanceTrip.findAll({
      include: [{ model: Ambulance, attributes: ['vehicle_no', 'driver_name', 'driver_phone'] }],
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    next(error);
  }
};

exports.completeTrip = async (req, res, next) => {
  try {
    const trip = await AmbulanceTrip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.status = 'completed';
    trip.drop_location = req.body.drop_location;
    trip.completed_at = new Date();
    await trip.save();

    const amb = await Ambulance.findByPk(trip.ambulance_id);
    if (amb) {
        amb.status = 'available';
        amb.current_location = req.body.drop_location;
        await amb.save();
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};
