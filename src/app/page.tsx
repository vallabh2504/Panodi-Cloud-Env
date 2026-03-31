'use client';

import { useState, useEffect } from 'react';
import { Camera, MapPin, Truck, CheckCircle, Smartphone } from 'lucide-react';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { addToQueue, Order } from '@/lib/db';

export default function Home() {
  const { isOnline } = useOfflineQueue();
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (data.success) {
      setIsLoggedIn(true);
      fetchOrders();
    } else {
      setError('Invalid OTP');
    }
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (data.success) {
      setOrders(data.orders);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const payload = { id: orderId, status };
    if (!isOnline) {
      await addToQueue({ type: 'UPDATE_ORDER', payload, timestamp: Date.now() });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } as Order : o));
      alert('Action queued offline');
      return;
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchOrders();
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
          <div className="text-center">
            <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Rendinti App Engine</h1>
            <p className="text-gray-500 mt-2">Rider App MVP</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                placeholder="+234 000 000 0000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                placeholder="123456"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Login to Deliver
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl text-gray-900">Rendinti</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{order.status}</span>
                <h2 className="text-lg font-bold text-gray-900">{order.id}</h2>
                <p className="text-sm text-gray-500">Merchant: {order.merchantId}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Items: {order.items.join(', ')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {order.status === 'pending' && (
                <button 
                  onClick={() => updateStatus(order.id, 'preparing')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Accept
                </button>
              )}
              {order.status === 'preparing' && (
                <button 
                  onClick={() => updateStatus(order.id, 'pickup')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-bold"
                >
                  <Camera className="w-4 h-4 mr-2" /> Pickup Photo
                </button>
              )}
              {order.status === 'pickup' && (
                <button 
                  onClick={() => updateStatus(order.id, 'delivered')}
                  className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center font-bold col-span-2"
                >
                  <Smartphone className="w-4 h-4 mr-2" /> Delivery OTP
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <nav className="fixed bottom-0 w-full bg-white border-t px-8 py-3 flex justify-around">
        <Truck className="w-6 h-6 text-blue-600" />
        <MapPin className="w-6 h-6 text-gray-400" />
        <Camera className="w-6 h-6 text-gray-400" />
      </nav>
    </main>
  );
}
