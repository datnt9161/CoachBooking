import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Calendar, ArrowRight, Clock, Bus, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

interface Route { id: number; departure: string; destination: string; }
interface Coach { id: number; licensePlate: string; type: string; totalSeats: number; }
interface Trip {
  id: number;
  route: Route;
  coach: Coach;
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
}

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [form, setForm] = useState({ routeId: '', coachId: '', departureTime: '', arrivalTime: '', price: '' });

  useEffect(() => {
    Promise.all([
      api.get('/admin/trips'),
      api.get('/admin/routes'),
      api.get('/admin/coaches')
    ]).then(([t, r, c]) => {
      setTrips(Array.isArray(t.data) ? t.data : []);
      setRoutes(Array.isArray(r.data) ? r.data : []);
      setCoaches(Array.isArray(c.data) ? c.data : []);
    }).catch(err => {
      console.error('Failed to fetch data:', err);
    }).finally(() => setLoading(false));
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/admin/trips');
      setTrips(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const openModal = (trip?: Trip) => {
    if (trip) {
      setEditing(trip);
      setForm({
        routeId: trip.route.id.toString(),
        coachId: trip.coach.id.toString(),
        departureTime: trip.departureTime.slice(0, 16),
        arrivalTime: trip.arrivalTime?.slice(0, 16) || '',
        price: trip.price.toString()
      });
    } else {
      setEditing(null);
      setForm({ routeId: '', coachId: '', departureTime: '', arrivalTime: '', price: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      routeId: Number(form.routeId),
      coachId: Number(form.coachId),
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime || null,
      price: Number(form.price)
    };
    try {
      if (editing) {
        await api.put(`/admin/trips/${editing.id}`, data);
      } else {
        await api.post('/admin/trips', data);
      }
      setShowModal(false);
      fetchTrips();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Xác nhận xóa chuyến xe này?')) return;
    try {
      await api.delete(`/admin/trips/${id}`);
      fetchTrips();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi');
    }
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý chuyến xe</h1>
          <p className="text-gray-400 mt-1">{trips.length} chuyến xe</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary px-5 py-2.5 flex items-center justify-center gap-2">
          <Plus size={18} /> Thêm chuyến
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Chưa có chuyến xe</h3>
          <p className="text-gray-400 mb-4">Bắt đầu bằng cách thêm chuyến xe đầu tiên</p>
          <button onClick={() => openModal()} className="btn-primary px-6 py-2.5">
            <Plus size={18} className="inline mr-2" /> Thêm chuyến
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((trip, index) => (
            <div 
              key={trip.id} 
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-gray-600 transition-all animate-slide-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Route & Time Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    trip.coach.type === 'VIP' 
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    <Calendar size={22} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                      <span>{trip.route.departure}</span>
                      <ArrowRight size={18} className="text-purple-400" />
                      <span>{trip.route.destination}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {format(new Date(trip.departureTime), 'HH:mm - dd/MM/yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus size={14} /> {trip.coach.licensePlate}
                      </span>
                      {trip.coach.type === 'VIP' && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Sparkles size={14} /> VIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price, Status & Actions */}
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(trip.status)}`}>
                    {trip.status}
                  </span>
                  <span className="text-xl font-bold text-orange-400">{formatPrice(trip.price)}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openModal(trip)} 
                      className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition flex items-center gap-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(trip.id)} 
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-gray-700 sticky top-0 bg-gray-800">
              <h2 className="text-lg font-bold text-white">{editing ? 'Sửa chuyến xe' : 'Thêm chuyến xe'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tuyến đường *</label>
                <select 
                  value={form.routeId} 
                  onChange={e => setForm({ ...form, routeId: e.target.value })} 
                  className="input-modern" 
                  required
                >
                  <option value="">Chọn tuyến đường</option>
                  {routes.map(r => <option key={r.id} value={r.id}>{r.departure} → {r.destination}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Xe *</label>
                <select 
                  value={form.coachId} 
                  onChange={e => setForm({ ...form, coachId: e.target.value })} 
                  className="input-modern" 
                  required
                >
                  <option value="">Chọn xe</option>
                  {coaches.map(c => <option key={c.id} value={c.id}>{c.licensePlate} ({c.type} - {c.totalSeats} ghế)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giờ khởi hành *</label>
                <input 
                  type="datetime-local" 
                  value={form.departureTime} 
                  onChange={e => setForm({ ...form, departureTime: e.target.value })} 
                  className="input-modern" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giờ đến (dự kiến)</label>
                <input 
                  type="datetime-local" 
                  value={form.arrivalTime} 
                  onChange={e => setForm({ ...form, arrivalTime: e.target.value })} 
                  className="input-modern" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giá vé (VND) *</label>
                <input 
                  type="number" 
                  value={form.price} 
                  onChange={e => setForm({ ...form, price: e.target.value })} 
                  className="input-modern" 
                  placeholder="150000"
                  required 
                />
              </div>
              <button type="submit" className="w-full btn-primary py-3 mt-2">
                {editing ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
