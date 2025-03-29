"use client";

import { useState } from "react";
import PDFViewer from "./PDFViewer";

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Get today's date in YYYY/MM/DD format
  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  // Initial order state
  const [order, setOrder] = useState({
    date: formattedDate,
    orderNumber: `ORD-${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0")}`,
    supplierName: "",
    supplierAddress: "",
    deliveryLocation: "平田トレーディング本社倉庫",
    requestedDeliveryDate: "",
    paymentMethod: "銀行振込",
    items: Array(10)
      .fill()
      .map(() => ({
        productName: "",
        productCode: "",
        quantity: 0,
        unit: "個",
        unitPrice: 0,
        amount: 0,
      })),
    notes: "",
  });

  // Calculate item amount when quantity or unitPrice changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...order.items];

    if (field === "quantity" || field === "unitPrice") {
      newItems[index][field] = parseFloat(value) || 0;
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice;
    } else {
      newItems[index][field] = value;
    }

    setOrder({ ...order, items: newItems });
  };

  // Calculate total amount
  const totalAmount = order.items.reduce((sum, item) => sum + item.amount, 0);

  // Generate PDF
  const generatePDF = async () => {
    setLoading(true);

    try {
      // In a real application, you would call the API to generate the PDF
      // For this template, we'll simulate a successful response

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mocked PDF URL (in a real app, this would be the actual PDF URL)
      setPdfUrl("#");
      setShowPdfViewer(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("PDFの生成中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generatePDF();
            }}
          >
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  日付
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="date"
                    name="date"
                    value={order.date}
                    onChange={(e) =>
                      setOrder({ ...order, date: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="orderNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  発注番号
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="orderNumber"
                    name="orderNumber"
                    value={order.orderNumber}
                    readOnly
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="supplierName"
                  className="block text-sm font-medium text-gray-700"
                >
                  サプライヤー名
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="supplierName"
                    name="supplierName"
                    value={order.supplierName}
                    onChange={(e) =>
                      setOrder({ ...order, supplierName: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="supplierAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  サプライヤー住所
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="supplierAddress"
                    name="supplierAddress"
                    value={order.supplierAddress}
                    onChange={(e) =>
                      setOrder({ ...order, supplierAddress: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="deliveryLocation"
                  className="block text-sm font-medium text-gray-700"
                >
                  納品場所
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="deliveryLocation"
                    name="deliveryLocation"
                    value={order.deliveryLocation}
                    onChange={(e) =>
                      setOrder({ ...order, deliveryLocation: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="requestedDeliveryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  希望納期
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="requestedDeliveryDate"
                    name="requestedDeliveryDate"
                    value={order.requestedDeliveryDate}
                    onChange={(e) =>
                      setOrder({
                        ...order,
                        requestedDeliveryDate: e.target.value,
                      })
                    }
                    placeholder="例: 2025/04/15"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  支払方法
                </label>
                <div className="mt-1">
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={order.paymentMethod}
                    onChange={(e) =>
                      setOrder({ ...order, paymentMethod: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="銀行振込">銀行振込</option>
                    <option value="請求書払い (30日)">請求書払い (30日)</option>
                    <option value="請求書払い (60日)">請求書払い (60日)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  発注商品
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          商品名
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          商品コード
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          数量
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          単位
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          単価 (円)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          金額 (円)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "productName",
                                  e.target.value
                                )
                              }
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={item.productCode}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "productCode",
                                  e.target.value
                                )
                              }
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={item.unit}
                              onChange={(e) =>
                                handleItemChange(index, "unit", e.target.value)
                              }
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="個">個</option>
                              <option value="箱">箱</option>
                              <option value="セット">セット</option>
                              <option value="kg">kg</option>
                              <option value="m">m</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "unitPrice",
                                  e.target.value
                                )
                              }
                              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-right font-semibold"
                        >
                          合計金額
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          {totalAmount.toLocaleString()} 円
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700"
                >
                  備考
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    value={order.notes}
                    onChange={(e) =>
                      setOrder({ ...order, notes: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? "PDF生成中..." : "PDFで出力"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPdfViewer && (
        <PDFViewer pdfUrl={pdfUrl} onClose={() => setShowPdfViewer(false)} />
      )}
    </>
  );
}
