const Appointment = require("../models/AppointmentModel");
const Doctor = require("../models/DoctorModel");
const User = require("../models/UserModel");

class AppointmentController {

    // [POST] /api/appointments
    createAppointment = async (req, res, next) => {
        try {
            const { patientId, doctorId, date, time } = req.body;

            if (!patientId || !doctorId || !date || !time) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            const patient = await User.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const appointment = new Appointment({
                patientId,
                doctorId,
                date,
                time
            });

            await appointment.save();

            res.status(201).json({
                message: 'Appointment created successfully',
                appointment
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Lịch hẹn bị trùng, vui lòng chọn khung giờ khác' });
            }
            next(error);
        }
    }

    // [GET] /api/appointments
    getAppointments = async (req, res) => {
        try {
            const appointments = await Appointment.find()
                .populate('patientId', 'name email username')
                .populate('doctorId', 'name specialty hospital price');

            res.json({
                appointments,
                status: 200
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/appointments/:id
    getAppointmentById = async (req, res) => {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findById(id)
                .populate('patientId', 'name email username')
                .populate('doctorId', 'name specialty hospital price');

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            res.json({ appointment });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [PUT] /api/appointments/:id
    updateAppointment = async (req, res) => {
        try {
            const { id } = req.params;
            const { date, time, status, doctorId } = req.body;

            const appointment = await Appointment.findById(id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            if (date) appointment.date = date;
            if (time) appointment.time = time;
            if (status) appointment.status = status;
            if (doctorId) appointment.doctorId = doctorId;

            await appointment.save();

            res.json({ message: 'Appointment updated', appointment });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Lịch hẹn bị trùng, vui lòng chọn khung giờ khác' });
            }
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [DELETE] /api/appointments/:id
    deleteAppointment = async (req, res) => {
        try {
            const { id } = req.params;
            const appointment = await Appointment.findByIdAndDelete(id);

            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            res.json({ message: 'Appointment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/appointments/doctor/:doctorId
    getAppointmentsByDoctor = async (req, res) => {
        try {
            const { doctorId } = req.params;
            const appointments = await Appointment.find({ doctorId })
                .populate('patientId', 'name email username')
                .populate('doctorId', 'name specialty hospital price');

            res.json({ appointments });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [GET] /api/appointments/patient/:patientId
    getAppointmentsByPatient = async (req, res) => {
        try {
            const { patientId } = req.params;
            const appointments = await Appointment.find({ patientId })
                .populate('patientId', 'name email username')
                .populate('doctorId', 'name specialty hospital price');

            res.json({ appointments });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new AppointmentController();
