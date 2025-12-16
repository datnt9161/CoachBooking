import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, Clock, XCircle, CheckCircle, AlertCircle, Calendar, MapPin, Bus, QrCode, Download, X, User, Phone } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: number;
  bookingCode: string;
  departure: string;
  destination: string;
  departureTime: string;
  coachType: string;
  licensePlate: string;
  seats: { seatNumber: string }[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  PENDING: { label: 'Chờ thanh toán', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', icon: AlertCircle },
  PAID: { label: 'Chờ xác nhận', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', icon: XCircle },
};

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  useEffect(() => {
    api.get('/bookings')
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Bạn có chắc muốn hủy vé này?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Hủy vé thất bại');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải danh sách vé...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ticket size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có vé nào</h2>
        <p className="text-gray-500 mb-6">Bạn chưa đặt vé xe nào. Hãy đặt vé ngay!</p>
        <Link to="/" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
          <Ticket size={18} /> Đặt vé ngay
        </Link>
      </div>
    );
  }

  // Ticket Modal Component
  const TicketModal = ({ booking, onClose }: { booking: Booking; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Bus size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">VÉ XE KHÁCH</h3>
              <p className="text-blue-200 text-sm">Coach Booking</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs">Mã vé</p>
              <p className="font-mono font-bold text-xl">{booking.bookingCode}</p>
            </div>
            <div className="bg-white p-2 rounded-xl">
              <QrCode size={48} className="text-gray-800" />
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6">
          {/* Route */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{booking.departure}</p>
              <p className="text-gray-500 text-sm">Điểm đi</p>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <Bus size={20} className="text-indigo-600" />
                <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
                <div className="w-3 h-3 rounded-full bg-purple-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{booking.destination}</p>
              <p className="text-gray-500 text-sm">Điểm đến</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Ngày khởi hành</p>
              <p className="font-bold text-gray-800">{format(new Date(booking.departureTime), 'dd/MM/yyyy')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Giờ khởi hành</p>
              <p className="font-bold text-gray-800">{format(new Date(booking.departureTime), 'HH:mm')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Số ghế</p>
              <p className="font-bold text-blue-600">{booking.seats.map(s => s.seatNumber).join(', ')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Biển số xe</p>
              <p className="font-bold text-gray-800">{booking.licensePlate}</p>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-600 text-xs font-medium mb-2">THÔNG TIN HÀNH KHÁCH</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-bold text-gray-800 flex items-center gap-1">
                  <User size={14} /> {user?.fullName || 'Khách hàng'}
                </p>
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <Phone size={12} /> {user?.phone || '---'}
                </p>
              </div>
            </div>
          </div>

          {/* Dashed Line */}
          <div className="border-t-2 border-dashed border-gray-200 my-4 relative">
            <div className="absolute -left-8 -top-3 w-6 h-6 bg-gray-100 rounded-full" />
            <div className="absolute -right-8 -top-3 w-6 h-6 bg-gray-100 rounded-full" />
          </div>

          {/* Total & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Tổng tiền</p>
              <p className="text-2xl font-bold text-orange-600">{formatPrice(booking.totalPrice)}</p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
            >
              <Download size={18} /> In vé
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-500">Vui lòng xuất trình vé này khi lên xe. Chúc quý khách thượng lộ bình an!</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Vé của tôi</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {bookings.length} vé
        </span>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, index) => {
          const status = STATUS_CONFIG[booking.status];
          const StatusIcon = status.icon;
          const isPending = booking.status === 'PENDING';
          const isConfirmed = booking.status === 'CONFIRMED';
          const canCancel = booking.status !== 'CANCELLED' && new Date(booking.departureTime) > new Date();

          return (
            <div 
              key={booking.id} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Status Bar */}
              <div className={`px-4 py-2 ${status.bgColor} border-b flex items-center justify-between`}>
                <span className={`flex items-center gap-1.5 text-sm font-medium ${status.color}`}>
                  <StatusIcon size={16} />
                  {status.label}
                </span>
                <span className="text-gray-500 text-sm font-mono">#{booking.bookingCode}</span>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Route Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-800 mb-3">
                      <MapPin size={18} className="text-blue-600" />
                      <span>{booking.departure}</span>
                      <ArrowRight className="text-blue-600" size={18} />
                      <span>{booking.destination}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{format(new Date(booking.departureTime), 'dd/MM/yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span>{format(new Date(booking.departureTime), 'HH:mm')}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-gray-400">Ghế:</span> <span className="font-medium text-blue-600">{booking.seats.map(s => s.seatNumber).join(', ')}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-gray-400">Loại:</span> {booking.coachType === 'VIP' ? '✨ VIP' : 'Thường'}
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                    <div className="lg:text-right">
                      <div className="text-sm text-gray-500">Tổng tiền</div>
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">{formatPrice(booking.totalPrice)}</div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {isConfirmed && (
                        <button
                          onClick={() => setSelectedTicket(booking)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition"
                        >
                          <Ticket size={16} /> Xem vé
                        </button>
                      )}
                      {booking.status === 'PAID' && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
                          <Clock size={16} /> Đang chờ xác nhận
                        </span>
                      )}
                      {isPending && (
                        <Link
                          to={`/payment/${booking.id}`}
                          className="btn-primary px-4 py-2 text-sm"
                        >
                          Thanh toán
                        </Link>
                      )}
                      {canCancel && booking.status !== 'PAID' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                        >
                          Hủy vé
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
}
