"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    // Try to get user name from stored data
    try {
      const userDataStr = localStorage.getItem("user");
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserName(userData.username || "ユーザー");
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="ダッシュボード" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                ようこそ、{userName}さん
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                平田トレーディング 見積・発注管理システムへようこそ。
                以下から操作を選択してください。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    見積書作成
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    お客様への見積書を作成し、PDFとして出力します。
                  </p>
                  <Link
                    href="/dashboard/estimates"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    見積書作成へ
                  </Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    発注書作成
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    サプライヤーへの発注書を作成し、PDFとして出力します。
                  </p>
                  <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    発注書作成へ
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    最近の見積
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    最近作成した見積書の履歴です。
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                      見積履歴はまだありません
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    最近の発注
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    最近作成した発注書の履歴です。
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-500">
                      発注履歴はまだありません
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
