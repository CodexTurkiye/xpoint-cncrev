"use client";

import { useMemo, useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, DollarSign, Package, User, Truck } from 'lucide-react';
import { JobEntry, JobItem, JobCost } from '@/lib/data';

export default function JobPage() {
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);
	const [customerName, setCustomerName] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [deliveryDate, setDeliveryDate] = useState("");
	const [notes, setNotes] = useState("");

	const [items, setItems] = useState<JobItem[]>([
		{ id: 1, description: 'Dolap kapısı kesimi', material: 'MDF 18mm', quantity: 10, unit: 'adet', unitPrice: 45 },
	]);

	const [costs, setCosts] = useState<JobCost[]>([
		{ id: 1, description: 'Nakliye', amount: 250, type: 'shipping' }
	]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

	const addItem = () => {
		setItems(prev => [
			...prev,
			{ id: Date.now(), description: '', material: '', quantity: 1, unit: 'adet', unitPrice: 0 }
		]);
	};

	const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

	const addCost = () => {
		setCosts(prev => [ ...prev, { id: Date.now(), description: '', amount: 0, type: 'other' } ]);
	};
	const removeCost = (id: number) => setCosts(prev => prev.filter(c => c.id !== id));

	const itemsSubtotal = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0), [items]);
	const costsTotal = useMemo(() => costs.reduce((sum, c) => sum + c.amount, 0), [costs]);
	const grandTotal = itemsSubtotal + costsTotal;

	const formatCurrency = (n: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0);

  const handleSaveJob = async () => {
    try {
      const jobData = {
        customerName,
        jobTitle,
        deliveryDate,
        notes,
        items,
        costs,
        createdAt: new Date().toISOString()
      };
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      
      if (response.ok) {
        const newJob = await response.json();
        setJobs([...jobs, newJob]);
        // Reset form
        setCustomerName("");
        setJobTitle("");
        setDeliveryDate("");
        setNotes("");
        setItems([{ id: 1, description: '', material: '', quantity: 1, unit: 'adet', unitPrice: 0 }]);
        setCosts([{ id: 1, description: '', amount: 0, type: 'other' }]);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">İş Kaydı</h1>
					<p className="text-gray-600 mt-2">Müşteri bazlı detaylı iş formu</p>
				</div>
			</div>

			{/* Customer and Job Info */}
			<div className="bg-white rounded-lg shadow p-6 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><User className="w-4 h-4 mr-2"/>Müşteri Adı</label>
						<input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Örn: Ahmet Yılmaz" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">İş Başlığı</label>
						<input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Örn: Dolap kapısı üretimi" />
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Teslim Tarihi</label>
						<input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
					<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Özel ölçüler, kalite notları, teslimat detayları…" />
				</div>
			</div>

			{/* Items */}
			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900 flex items-center"><Package className="w-5 h-5 mr-2"/>Kullanılan Ürünler / İş Kalemleri</h2>
					<button onClick={addItem} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-1"/>Kalem Ekle</button>
				</div>
				<div className="p-6 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Malzeme</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Miktar</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Birim</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
								<th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
								<th className="px-4 py-2"></th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{items.map(item => (
								<tr key={item.id}>
									<td className="px-4 py-2"><input value={item.description} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, description: e.target.value } : p))} className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="İş açıklaması" /></td>
									<td className="px-4 py-2"><input value={item.material} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, material: e.target.value } : p))} className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="Örn: MDF 18mm" /></td>
									<td className="px-4 py-2 w-28"><input type="number" value={item.quantity} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, quantity: Number(e.target.value) } : p))} className="w-full px-2 py-1 border border-gray-300 rounded" /></td>
									<td className="px-4 py-2 w-28"><input value={item.unit} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, unit: e.target.value } : p))} className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="adet, m²" /></td>
									<td className="px-4 py-2 w-36"><input type="number" step="0.01" value={item.unitPrice} onChange={e => setItems(prev => prev.map(p => p.id === item.id ? { ...p, unitPrice: Number(e.target.value) } : p))} className="w-full px-2 py-1 border border-gray-300 rounded" /></td>
									<td className="px-4 py-2 text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
									<td className="px-4 py-2 text-right"><button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
					<div className="text-right">
						<div className="text-sm text-gray-600">İş Kalemleri Toplamı</div>
						<div className="text-xl font-semibold">{formatCurrency(itemsSubtotal)}</div>
					</div>
				</div>
			</div>

			{/* Costs */}
			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-900 flex items-center"><DollarSign className="w-5 h-5 mr-2"/>Ek Masraflar</h2>
					<button onClick={addCost} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-1"/>Masraf Ekle</button>
				</div>
				<div className="p-6 overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
								<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tür</th>
								<th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Tutar</th>
								<th className="px-4 py-2"></th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{costs.map(cost => (
								<tr key={cost.id}>
									<td className="px-4 py-2"><input value={cost.description} onChange={e => setCosts(prev => prev.map(c => c.id === cost.id ? { ...c, description: e.target.value } : c))} className="w-full px-2 py-1 border border-gray-300 rounded" placeholder="Örn: Nakliye" /></td>
									<td className="px-4 py-2 w-44">
										<select value={cost.type} onChange={e => setCosts(prev => prev.map(c => c.id === cost.id ? { ...c, type: e.target.value as JobCost['type'] } : c))} className="w-full px-2 py-1 border border-gray-300 rounded">
											<option value="material">Malzeme</option>
											<option value="labor">İşçilik</option>
											<option value="shipping">Nakliye</option>
											<option value="other">Diğer</option>
										</select>
									</td>
									<td className="px-4 py-2 w-36 text-right"><input type="number" step="0.01" value={cost.amount} onChange={e => setCosts(prev => prev.map(c => c.id === cost.id ? { ...c, amount: Number(e.target.value) } : c))} className="w-full px-2 py-1 border border-gray-300 rounded text-right" /></td>
									<td className="px-4 py-2 text-right"><button onClick={() => removeCost(cost.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-8">
					<div className="text-right">
						<div className="text-sm text-gray-600">Masraf Toplamı</div>
						<div className="text-xl font-semibold">{formatCurrency(costsTotal)}</div>
					</div>
					<div className="text-right">
						<div className="text-sm text-gray-600">Genel Toplam</div>
						<div className="text-2xl font-bold text-gray-900">{formatCurrency(grandTotal)}</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end">
				<button 
          onClick={handleSaveJob}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Calculator className="w-4 h-4 mr-2"/>Kaydı Oluştur
        </button>
			</div>
		</div>
	);
}
