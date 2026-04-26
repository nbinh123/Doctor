import { useState } from "react";
import Card from "@tremor/react";
import { UserIcon } from "@phosphor-icons/react";



export default function User() {
  const [user, setUser] = useState({
    name: "Nguyễn Văn A",
    email: "",
    phone: "0123456789",
  });

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
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-100 p-3 text-sky-700"><UserRound size={20} /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Tài khoản người dùng</h2>
              <p className="text-sm text-slate-500">Quản lý hồ sơ và lịch hẹn</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <input value={user.name} onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
            <input value={user.email} onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
            <input value={user.phone} onChange={(e) => setUser((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-2xl border border-sky-100 px-4 py-3" />
            <button className="rounded-2xl bg-sky-600 px-6 py-3 font-semibold text-white">Cập nhật thông tin cá nhân</button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-800">Lịch đã đặt</h3>
          <div className="mt-5 space-y-4">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-3xl border border-sky-100 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">{a.doctorName}</div>
                    <div className="text-sm text-slate-500">{a.date} • {a.time} • {a.mode === "online" ? "Online" : "Offline"}</div>
                  </div>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">{a.status}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-700">Đổi lịch</button>
                  <button className="rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600">Hủy lịch</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}