import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Info, MapPin, Calendar, Bus, Sparkles, User } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

interface Trip {
  id: number;
  departure: string;
  destination: string;
  departureTime: string;
  price: number;
  coachType: string;
  licensePlate: string;
  totalSeats: number;
}

interface Seat {
  id: number;
  seatNumber: string;
  status: string;
}

export default function Booking() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, seatsRes] = await Promise.all([
          api.get(`/trips/${tripId}`),
          api.get(`/seats/trip/${tripId}`)
        ]);
        setTrip(tripRes.data);
        setSeats(Array.isArray(seatsRes.data) ? seatsRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  const toggleSeat = (seatId: number, status: string) => {
    if (status !== 'AVAILABLE') return;
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    setBooking(true);
    try {
      const res = await api.post('/bookings', { tripId: Number(tripId), seatIds: selectedSeats });
      navigate(`/payment/${res.data.id}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Đặt vé thất bại');
    } finally {
      setBooking(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Find seat by number
  const findSeat = (seatNumber: string): Seat | undefined => {
    return seats.find(s => s.seatNumber === seatNumber);
  };

  // Render a single seat
  const renderSeat = (seatNumber: string) => {
    const seat = findSeat(seatNumber);
    if (!seat) {
      return <div key={seatNumber} className="w-11 h-9" />; // Empty placeholder
    }

    const isSelected = selectedSeats.includes(seat.id);
    const isBooked = seat.status === 'BOOKED';
    
    return (
      <button
        key={seat.id}
        onClick={() => toggleSeat(seat.id, seat.status)}
        disabled={isBooked}
        className={`
          relative w-11 h-9 rounded-lg border-2 transition-all duration-200 text-xs font-bold
          flex items-center justify-center
          ${isBooked 
            ? 'bg-gray-400 border-gray-500 text-white cursor-not-allowed' 
            : isSelected 
              ? 'bg-gradient-to-br from-orange-500 to-red-500 border-orange-600 text-white shadow-lg scale-105' 
              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
          }
        `}
        title={isBooked ? 'Đã đặt' : isSelected ? 'Đang chọn' : 'Còn trống'}
      >
        {isSelected ? <Check size={14} /> : seatNumber}
      </button>
    );
  };

  // Render driver seat with label
  const renderDriver = () => (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center border-2 border-slate-600 shadow-md">
        <div className="text-center">
          <User size={16} className="text-white mx-auto" />
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-600 uppercase">Tài xế</span>
    </div>
  );

  // Render stairs/door with label
  const renderStairs = () => (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center border-2 border-amber-300 shadow-md">
        <div className="flex flex-col gap-0.5">
          <div className="w-7 h-1 bg-amber-500 rounded" />
          <div className="w-7 h-1 bg-amber-500 rounded" />
          <div className="w-7 h-1 bg-amber-500 rounded" />
        </div>
      </div>
      <span className="text-[10px] font-bold text-amber-600 uppercase">Cửa lên</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  if (!trip) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Không tìm thấy chuyến xe</p>
    </div>
  );

  const totalPrice = selectedSeats.length * trip.price;

  return (
    <div className="animate-fade-in">
      {/* Trip Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-6 mb-6 text-white shadow-xl">
        <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-2">
          <MapPin size={20} />
          <span>{trip.departure}</span>
          <ArrowRight size={20} />
          <span>{trip.destination}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-blue-100 text-sm">
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {format(new Date(trip.departureTime), 'HH:mm - dd/MM/yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Bus size={16} />
            {trip.licensePlate}
          </span>
          {trip.coachType === 'VIP' && (
            <span className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded-full">
              <Sparkles size={14} /> VIP
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Seat Selection */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bus className="text-blue-600" />
              SƠ ĐỒ XE GIƯỜNG NẰM 41 GIƯỜNG
            </h2>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md border-2 bg-white border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">A1</div>
                <span className="text-sm text-gray-600">Còn trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md border-2 bg-gradient-to-br from-orange-500 to-red-500 border-orange-600 flex items-center justify-center text-white">
                  <Check size={12} />
                </div>
                <span className="text-sm text-gray-600">Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md border-2 bg-gray-400 border-gray-500 flex items-center justify-center text-xs font-bold text-white">X</div>
                <span className="text-sm text-gray-600">Đã đặt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 flex items-center justify-center">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-sm text-gray-600">Tài xế</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center">
                  <div className="flex flex-col gap-0.5">
                    <div className="w-5 h-0.5 bg-amber-500 rounded" />
                    <div className="w-5 h-0.5 bg-amber-500 rounded" />
                  </div>
                </div>
                <span className="text-sm text-gray-600">Cửa lên</span>
              </div>
            </div>

            {/* Bus Layout - 2 Floors */}
            <div className="space-y-6">
              {/* TẦNG 1 - 18 ghế (A1-A18) */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">TẦNG 1</span>
                  <span className="text-xs text-slate-500">18 giường</span>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex gap-4">
                    {/* Seats area */}
                    <div className="flex-1">
                      {/* Row 1 */}
                      <div className="flex items-center gap-1.5 mb-2 justify-start">
                        {renderSeat('A16')}
                        {renderSeat('A13')}
                        {renderSeat('A10')}
                        {renderSeat('A7')}
                        {renderSeat('A4')}
                        {renderSeat('A1')}
                      </div>
                      
                      {/* Row 2 */}
                      <div className="flex items-center gap-1.5 mb-2 justify-start">
                        {renderSeat('A17')}
                        {renderSeat('A14')}
                        {renderSeat('A11')}
                        {renderSeat('A8')}
                        {renderSeat('A5')}
                        {renderSeat('A2')}
                      </div>
                      
                      {/* Row 3 */}
                      <div className="flex items-center gap-1.5 justify-start">
                        {renderSeat('A18')}
                        {renderSeat('A15')}
                        {renderSeat('A12')}
                        {renderSeat('A9')}
                        {renderSeat('A6')}
                        {renderSeat('A3')}
                      </div>
                    </div>
                    
                    {/* Driver & Door area */}
                    <div className="flex flex-col items-center justify-between border-l-2 border-dashed border-slate-200 pl-4">
                      {renderDriver()}
                      {renderStairs()}
                    </div>
                  </div>
                </div>
              </div>

              {/* TẦNG 2 - 23 ghế (B1-B23) */}
              <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-sm font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">TẦNG 2</span>
                  <span className="text-xs text-slate-500">23 giường</span>
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <div className="flex gap-4">
                    {/* Seats area */}
                    <div className="flex-1">
                      {/* Row 1 */}
                      <div className="flex items-center gap-1.5 mb-2 justify-start">
                        {renderSeat('B19')}
                        {renderSeat('B16')}
                        {renderSeat('B13')}
                        {renderSeat('B10')}
                        {renderSeat('B7')}
                        {renderSeat('B4')}
                        {renderSeat('B1')}
                      </div>
                      
                      {/* Row 2 */}
                      <div className="flex items-center gap-1.5 mb-2 justify-start">
                        {renderSeat('B20')}
                        {renderSeat('B17')}
                        {renderSeat('B14')}
                        {renderSeat('B11')}
                        {renderSeat('B8')}
                        {renderSeat('B5')}
                        {renderSeat('B2')}
                      </div>
                      
                      {/* Row 3 */}
                      <div className="flex items-center gap-1.5 justify-start">
                        {renderSeat('B21')}
                        {renderSeat('B22')}
                        {renderSeat('B23')}
                        {renderSeat('B18')}
                        {renderSeat('B15')}
                        {renderSeat('B12')}
                        {renderSeat('B9')}
                        {renderSeat('B6')}
                        {renderSeat('B3')}
                      </div>
                    </div>
                    
                    {/* Driver & Door area */}
                    <div className="flex flex-col items-center justify-between border-l-2 border-dashed border-slate-200 pl-4">
                      {renderDriver()}
                      {renderStairs()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected seats summary */}
            {selectedSeats.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">Ghế đã chọn:</span>{' '}
                  {seats.filter(s => selectedSeats.includes(s.id)).map(s => s.seatNumber).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="order-1 lg:order-2">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chi tiết đặt vé</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Ghế đã chọn</span>
                <span className="font-semibold text-right max-w-[150px] text-blue-600">
                  {selectedSeats.length > 0
                    ? seats.filter(s => selectedSeats.includes(s.id)).map(s => s.seatNumber).join(', ')
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Số lượng</span>
                <span className="font-semibold">{selectedSeats.length} vé</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Đơn giá</span>
                <span className="font-semibold">{formatPrice(trip.price)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 mt-4 bg-gradient-to-r from-orange-50 to-red-50 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-xl">
              <span className="font-bold text-gray-800">Tổng tiền</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {booking ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Tiếp tục đặt vé <ArrowRight size={18} /></>
              )}
            </button>

            {selectedSeats.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
                <Info size={14} /> Vui lòng chọn ít nhất 1 ghế
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
