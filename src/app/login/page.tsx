"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password })
			});
			if (res.ok) {
				router.replace("/");
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data?.message || "Giriş başarısız. Bilgileri kontrol edin.");
			}
		} catch (err) {
			setError("Bir hata oluştu. Tekrar deneyin.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="w-full max-w-md bg-white rounded-lg shadow p-8">
				<h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Xpoint Giriş</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
					>
						{loading ? "Giriş yapılıyor..." : "Giriş Yap"}
					</button>
					<p className="text-xs text-gray-500 mt-2 text-center">Varsayılan: admin / xpoint123</p>
				</form>
			</div>
		</div>
	);
}



