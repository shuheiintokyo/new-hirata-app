"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import OrderForm from "@/app/components/OrderForm";

export default function OrderPage() {
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
      <Header title="発注書作成" />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              発注書作成
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              サプライヤー向けの発注書を作成します。必要な情報を入力し、PDFで出力してください。
            </p>

            <OrderForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
