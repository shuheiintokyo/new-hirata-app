"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header({ title }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    // Redirect to login page
    router.push("/");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {title || "平田トレーディング"}
        </h1>
        <div>
          <Link
            href="/dashboard"
            className="mr-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ダッシュボード
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
