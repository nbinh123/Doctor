import { useNavigate } from "react-router-dom";
import Card from "../components/tool/Card";
import formatMoney from "../utils/format";
import fakeApi from "../utils/fakeApi";
import { useState } from "react";

const paymentMethods = ["Thẻ tín dụng", "Ví điện tử", "Chuyển khoản ngân hàng"];

export default function Payment() {
  const [appointments, setAppointments] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({ id: "D1", name: "Dr. Nguyễn Văn A", fee: 200000 });
  const [selectedDate, setSelectedDate] = useState("2024-07-15");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [bookingMode, setBookingMode] = useState("online");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleConfirmBooking() {
    setLoading(true);
    await fakeApi();
    const bookingId = `BK-${Date.now().toString().slice(-8)}`;
    setAppointments((prev) => [
      {
        id: bookingId,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        mode: bookingMode,
        status: "Chờ xác nhận",
      },
      ...prev,
    ]);
    setHistory((prev) => [
      {
        date: selectedDate,
        doctorName: selectedDoctor.name,
        reason: `Đặt lịch ${bookingMode === "online" ? "trực tuyến" : "trực tiếp"}`,
        note: `Thanh toán: ${paymentMethod}. Mã lịch hẹn: ${bookingId}.`,
      },
      ...prev,
    ]);
    setLoading(false);
    navigate("submit");
  }
  
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <Card className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-800">Thanh toán</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-sky-50 p-5">
            <div className="text-sm text-slate-500">Chi phí khám</div>
            <div className="mt-2 text-3xl font-bold text-slate-800">{formatMoney(selectedDoctor.fee)}</div>
            <div className="mt-3 text-sm text-slate-600">Bác sĩ: {selectedDoctor.name}</div>
            <div className="text-sm text-slate-600">Ngày: {selectedDate || "Chưa chọn"} • {selectedTime || "Chưa chọn"}</div>
            <div className="text-sm text-slate-600">Hình thức: {bookingMode === "online" ? "Online" : "Offline"}</div>
          </div>

          <div>
            <div className="mb-3 font-semibold text-slate-800">Chọn phương thức thanh toán</div>
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <button key={m} onClick={() => setPaymentMethod(m)} className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-medium ${paymentMethod === m ? "border-sky-500 bg-sky-50 text-sky-700" : "border-sky-100 bg-white text-slate-600"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate("booking")} className="rounded-2xl border border-sky-200 px-6 py-3 font-semibold text-sky-700">Quay lại</button>
          <button onClick={handleConfirmBooking} disabled={loading} className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white disabled:bg-sky-300">{loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}</button>
        </div>
      </Card>
    </main>
  );
}
