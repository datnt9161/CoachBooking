import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Users, Bus, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Trip {
  id: number;
  departure: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  coachType: string;
  licensePlate: string;
  totalSeats: number;
  availableSeats: number;
}

export default function Trips() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchTrips = async () => {
      try {
        const res = await api.post('/trips/search', {
          departure: searchParams.get('departure'),
          destination: searchParams.get('destination'),
          departureDate: searchParams.get('departureDate'),
          coachType: searchParams.get('coachType') || null
        });
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    searchTrips();
  }, [searchParams]);

  const handleSelectTrip = (tripId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${tripId}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatTime = (dateStr: string) => format(new Date(dateStr), 'HH:mm');
  const formatDate = (dateStr: string) => format(new Date(dateStr), 'EEEE, dd/MM/yyyy', { locale: vi });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500">Đang tìm chuyến xe...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-6 mb-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold mb-1">
              <MapPin size={20} />
              <span>{searchParams.get('departure')}</span>
              <ArrowRight size={20} />
              <span>{searchParams.get('destination')}</span>
            </div>
            <p className="text-blue-100 capitalize">
              {searchParams.get('departureDate') && formatDate(searchParams.get('departureDate')!)}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Bus size={18} />
            <span className="font-medium">{trips.length} chuyến xe</span>
          </div>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bus size={40} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy chuyến xe</h2>
          <p className="text-gray-500 mb-6">Vui lòng thử tìm kiếm với ngày khác hoặc tuyến đường khác</p>
          <button onClick={() => navigate('/')} className="btn-primary px-6 py-3">
            Tìm kiếm lại
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, index) => (
            <div 
              key={trip.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                  {/* Time & Route */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600">{formatTime(trip.departureTime)}</div>
                        <div className="text-sm text-gray-500">{trip.departure}</div>
                      </div>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-400 to-gray-200 rounded" />
                        <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          <Clock size={12} />
                          <span>~3h</span>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-gray-200 to-emerald-400 rounded" />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                          {trip.arrivalTime ? formatTime(trip.arrivalTime) : '--:--'}
                        </div>
                        <div className="text-sm text-gray-500">{trip.destination}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        trip.coachType === 'VIP' 
                          ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {trip.coachType === 'VIP' && <Sparkles size={14} />}
                        {trip.coachType === 'VIP' ? 'Xe VIP' : 'Xe thường'}
                      </span>
                      <span className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600">
                        {trip.licensePlate}
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        trip.availableSeats > 5 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : trip.availableSeats > 0 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        <Users size={14} className="inline mr-1" />
                        Còn {trip.availableSeats}/{trip.totalSeats} chỗ
                      </span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                    <div className="lg:text-right">
                      <div className="text-sm text-gray-500">Giá vé</div>
                      <div className="text-2xl sm:text-3xl font-bold text-orange-600">{formatPrice(trip.price)}</div>
                    </div>
                    <button
                      onClick={() => handleSelectTrip(trip.id)}
                      disabled={trip.availableSeats === 0}
                      className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all ${
                        trip.availableSeats === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'btn-primary'
                      }`}
                    >
                      {trip.availableSeats === 0 ? 'Hết chỗ' : 'Chọn chuyến'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
