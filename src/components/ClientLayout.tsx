"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAuthPage = pathname?.startsWith("/login");

	if (isAuthPage) {
		return (
			<div className="min-h-screen bg-gray-100">
				<main className="flex-1">
					<div className="p-6">{children}</div>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />
			<main className="flex-1 lg:ml-0">
				<div className="p-6 lg:ml-64">{children}</div>
			</main>
		</div>
	);
}



