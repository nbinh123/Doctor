// bắt đầu với file home
// là trang dành cho trang chủ, chứa các thông tin tổng quát
// bất cứ file nào cũng phải import các thư viện như thế này

const express = require("express")
const router = express.Router()
// nạp file HomeController
const AppointmentController = require("../../controllers/AppointmentController")
const authMiddleware = require("../middleware/auth.middleware")

router.get('/', authMiddleware, AppointmentController.getAppointments)
router.post('/', authMiddleware, AppointmentController.createAppointment)
router.get('/:id', authMiddleware, AppointmentController.getAppointmentById)

// 2 cái này không khớp với mô hình hiện tại, có thể sẽ cần chỉnh sửa lại
router.put('/:id', authMiddleware, AppointmentController.updateAppointment)
router.delete('/:id', authMiddleware, AppointmentController.deleteAppointment)



module.exports = router