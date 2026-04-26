import { useState } from "react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import Card from "../components/tool/Card";
import { formatMoney } from "../utils/format";
import { useNavigate } from "react-router-dom";

export default function SubmitBooking() {

  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingMode, setBookingMode] = useState("online");
  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  const [appointments, setAppointments] = useState([
    {
      id: "BK-20260420-01",
      doctorId: 1,
      doctorName: "BS. Nguyễn Minh Anh",
      date: "2026-04-24",
      time: "09:00",
      mode: "online",
      status: "Đã xác nhận",
    },
  ]);
  const latest = appointments[0];
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircleIcon size={24} />
          <h2 className="text-2xl font-bold text-slate-800">Đặt lịch thành công</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">Thông tin bên dưới là giả lập, dùng để mô phỏng màn hình xác nhận hoàn chỉnh.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-sky-50 p-5">
            <div className="text-sm text-slate-500">Mã lịch hẹn</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{latest?.id}</div>
          </div>
          <div className="rounded-3xl bg-sky-50 p-5">
            <div className="text-sm text-slate-500">Lưu ý tiếp theo</div>
            <div className="mt-2 text-sm leading-6 text-slate-600">Vui lòng đến trước 10 phút, mang theo giấy tờ cá nhân và chuẩn bị sẵn thông tin triệu chứng.</div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-sky-100 p-5">
          <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <div><span className="font-semibold text-slate-800">Bác sĩ:</span> {selectedDoctor.name}</div>
            <div><span className="font-semibold text-slate-800">Chuyên khoa:</span> {selectedDoctor.specialty}</div>
            <div><span className="font-semibold text-slate-800">Ngày:</span> {selectedDate}</div>
            <div><span className="font-semibold text-slate-800">Giờ:</span> {selectedTime}</div>
            <div><span className="font-semibold text-slate-800">Hình thức:</span> {bookingMode === "online" ? "Online" : "Offline"}</div>
            <div><span className="font-semibold text-slate-800">Thanh toán:</span> {paymentMethod}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate("/user")} className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white">Vào tài khoản</button>
          <button onClick={() => navigate("/home")} className="rounded-2xl border border-sky-200 px-6 py-3 font-semibold text-sky-700">Về trang chủ</button>
        </div>
      </Card>
    </main>
  );
}