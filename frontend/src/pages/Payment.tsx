import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, ArrowRight, CreditCard, QrCode, Smartphone, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/axios';

interface BookingDetail {
  id: number;
  bookingCode: string;
  departure: string;
  destination: string;
  departureTime: string;
  coachType: string;
  seats: { seatNumber: string }[];
  totalPrice: number;
  status: string;
}

interface PaymentQR {
  qrCodeUrl: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  transferContent: string;
  amount: number;
}

const PAYMENT_METHODS = [
  { id: 'BANK_TRANSFER', name: 'Chuyển khoản', icon: Building2, color: 'from-blue-500 to-blue-600' },
  { id: 'MOMO', name: 'MoMo', icon: Smartphone, color: 'from-pink-500 to-pink-600' },
  { id: 'VNPAY', name: 'VNPay', icon: CreditCard, color: 'from-red-500 to-red-600' },
];

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [paymentQR, setPaymentQR] = useState<PaymentQR | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('BANK_TRANSFER');
  const [copied, setCopied] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`).then(res => setBooking(res.data));
  }, [bookingId]);

  useEffect(() => {
    if (booking && selectedMethod) {
      api.get(`/bookings/${bookingId}/payment-qr?paymentMethod=${selectedMethod}`)
        .then(res => setPaymentQR(res.data))
        .catch(console.error);
    }
  }, [bookingId, booking, selectedMethod]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      await api.post('/bookings/payment', {
        bookingId: Number(bookingId),
        paymentMethod: selectedMethod
      });
      navigate('/bookings');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xác nhận thất bại');
    } finally {
      setConfirming(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-500">Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Thanh toán</h1>
              <p className="text-blue-100">Mã đặt vé: {booking.bookingCode}</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-5 mb-6">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
              <span>{booking.departure}</span>
              <ArrowRight className="text-blue-600" size={18} />
              <span>{booking.destination}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Thời gian</span>
                <p className="font-medium">{format(new Date(booking.departureTime), 'HH:mm - dd/MM/yyyy')}</p>
              </div>
              <div>
                <span className="text-gray-500">Ghế</span>
                <p className="font-medium">{booking.seats.map(s => s.seatNumber).join(', ')}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="font-semibold text-gray-700">Tổng tiền</span>
              <span className="text-2xl font-bold text-orange-600">{formatPrice(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Phương thức thanh toán</h3>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map(method => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                    <div className={`w-10 h-10 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">{method.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* QR Code & Bank Info */}
          {paymentQR && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="text-center">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 inline-block shadow-sm">
                  <img
                    src={`http://localhost:8081${paymentQR.qrCodeUrl}`}
                    alt="QR Code"
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">Quét mã QR để thanh toán</p>
              </div>

              {/* Bank Details */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800">Thông tin chuyển khoản</h3>
                
                {paymentQR.bankName && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Ngân hàng</div>
                    <div className="font-semibold text-gray-800">{paymentQR.bankName}</div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Số tài khoản</div>
                    <div className="font-semibold text-gray-800">{paymentQR.accountNumber}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentQR.accountNumber, 'account')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    {copied === 'account' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-400" />}
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-1">Chủ tài khoản</div>
                  <div className="font-semibold text-gray-800">{paymentQR.accountName}</div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Số tiền</div>
                    <div className="font-bold text-orange-600">{formatPrice(paymentQR.amount)}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentQR.amount.toString(), 'amount')}
                    className="p-2 hover:bg-gray-200 rounded-lg transition"
                  >
                    {copied === 'amount' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-blue-600 mb-1">Nội dung chuyển khoản</div>
                    <div className="font-bold text-blue-800 truncate">{paymentQR.transferContent}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentQR.transferContent, 'content')}
                    className="p-2 hover:bg-blue-100 rounded-lg transition ml-2"
                  >
                    {copied === 'content' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-blue-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleConfirmPayment}
              disabled={confirming}
              className="w-full btn-success py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {confirming ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard size={20} />
                  Tôi đã thanh toán
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Nhấn nút sau khi bạn đã chuyển khoản thành công
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
