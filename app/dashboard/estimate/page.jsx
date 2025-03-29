// app/dashboard/estimates/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import EstimateForm from "@/app/components/EstimateForm";

export default function EstimatePage() {
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="見積書作成" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              見積書作成
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              顧客向けの見積書を作成します。必要な情報を入力し、PDFで出力してください。
            </p>

            <EstimateForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
