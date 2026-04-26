
const express = require("express")
const router = express.Router()
// nạp file HomeController
const BookingController = require("../../controllers/BookingController")
const authMiddleware = require("../middleware/auth.middleware")

router.get('/:id', authMiddleware, BookingController.getBookingById)
router.delete('/:id', authMiddleware, BookingController.deleteBooking)
router.post('/', authMiddleware, BookingController.createBooking)


module.exports = router