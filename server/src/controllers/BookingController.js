const Booking = require("../models/BookingModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

class BookingController {
    // [POST] /api/bookings
    createBooking = async (req, res, next) => {
        try {
            const { patientId, doctorId, date, time } = req.body;

            if (!patientId || !doctorId || !date || !time) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            const booking = new Booking({
                patientId,
                doctorId,
                date,
                time
            });

            await booking.save();

            res.status(201).json({
                message: 'Booking created successfully',
                booking
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Lịch hẹn bị trùng, vui lòng chọn khung giờ khác' });
            }
            next(error);
        }
    }
    
    // [GET] /api/bookings/:id
    getBookingById = async (req, res    ) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findById(id)
                .populate('patientId', 'name email username')
                .populate('doctorId', 'name specialty hospital price');

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            res.json({ booking });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // [DELETE] /api/bookings/:id
    deleteBooking = async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findByIdAndDelete(id);

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            res.json({ message: 'Booking deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}

module.exports = new BookingController;