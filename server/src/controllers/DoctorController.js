const Doctor = require("../models/DoctorModel");

class DoctorController {

    // [POST] /api/doctors
    createDoctor = async (req, res, next) => {
        try {
            const { name, specialty, hospital, price } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'Name is required' });
            }

            const newDoctor = new Doctor({
                name,
                specialty,
                hospital,
                price
            });

            await newDoctor.save();

            res.status(201).json({
                message: 'Doctor created successfully',
                doctor: newDoctor
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /api/doctors
    getDoctors = async (req, res) => {
        try {
            const doctors = await Doctor.find();
            res.json({ doctors, status: 200 });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/doctors/:id
    getDoctorById = async (req, res) => {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findById(id);

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            res.json({ doctor });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [PUT] /api/doctors/:id
    updateDoctor = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, specialty, hospital, price } = req.body;

            const doctor = await Doctor.findById(id);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            if (name) doctor.name = name;
            if (specialty) doctor.specialty = specialty;
            if (hospital) doctor.hospital = hospital;
            if (price !== undefined) doctor.price = price;

            await doctor.save();

            res.json({ message: 'Doctor updated successfully', doctor });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [DELETE] /api/doctors/:id
    deleteDoctor = async (req, res) => {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findByIdAndDelete(id);

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            res.json({ message: 'Doctor deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/doctors/search
    searchDoctors = async (req, res) => {
        try {
            const { specialty, hospital, name } = req.query;
            const query = {};

            if (specialty) query.specialty = new RegExp(specialty, 'i');
            if (hospital) query.hospital = new RegExp(hospital, 'i');
            if (name) query.name = new RegExp(name, 'i');

            const doctors = await Doctor.find(query);
            res.json({ doctors });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/doctors/specialties/:specialty
    searchDoctorsBySpecialty = async (req, res) => {
        try {
            const { specialty } = req.params;
            const doctors = await Doctor.find({ specialty: new RegExp(specialty, 'i') });
            res.json({ doctors });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/doctors/:id/schedule
    getDoctorSchedule = async (req, res) => {
        try {
            const { id } = req.params;
            const doctor = await Doctor.findById(id);

            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            res.json({ schedule: doctor.shedule || [] });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new DoctorController();
