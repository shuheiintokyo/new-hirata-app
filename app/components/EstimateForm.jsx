"use client";

import { useState } from "react";
import PDFViewer from "./PDFViewer";

export default function EstimateForm() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  // Get today's date in YYYY/MM/DD format
  const today = new Date();
  const formattedDate = `${today.getFullYear()}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}`;

  // Initial estimate state
  const [estimate, setEstimate] = useState({
    date: formattedDate,
    estimateNumber: `EST-${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 1000
    )
      .toString()
      .padStart(3, "0")}`,
    clientName: "",
    clientAddress: "",
    deliveryLocation: "",
    leadTime: "2週間",
    paymentMethod: "銀行振込",
    validUntil: "発行日より30日間",
    items: Array(10)
      .fill()
      .map(() => ({
        productName: "",
        quantity: 0,
        unit: "個",
        unitPrice: 0,
        amount: 0,
      })),
    notes: "",
  });

  // Calculate item amount when quantity or unitPrice changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...estimate.items];

    if (field === "quantity" || field === "unitPrice") {
      newItems[index][field] = parseFloat(value) || 0;
      newItems[index].amount =
        newItems[index].quantity * newItems[index].unitPrice;
    } else {
      newItems[index][field] = value;
    }

    setEstimate({ ...estimate, items: newItems });
  };

  // Calculate total amount
  const totalAmount = estimate.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // Generate PDF
  const generatePDF = async () => {
    setLoading(true);

    try {
      // In a real application, you would call the API to generate the PDF
      // For this template, we'll simulate a successful response

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mocked PDF URL (in a real app, this would be the actual PDF URL)
      // For demo purposes we're just showing the viewer would appear
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
                    value={estimate.date}
                    onChange={(e) =>
                      setEstimate({ ...estimate, date: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="estimateNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  見積番号
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="estimateNumber"
                    name="estimateNumber"
                    value={estimate.estimateNumber}
                    readOnly
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="clientName"
                  className="block text-sm font-medium text-gray-700"
                >
                  お客様名
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={estimate.clientName}
                    onChange={(e) =>
                      setEstimate({ ...estimate, clientName: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="clientAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  お客様住所
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="clientAddress"
                    name="clientAddress"
                    value={estimate.clientAddress}
                    onChange={(e) =>
                      setEstimate({
                        ...estimate,
                        clientAddress: e.target.value,
                      })
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
                    value={estimate.deliveryLocation}
                    onChange={(e) =>
                      setEstimate({
                        ...estimate,
                        deliveryLocation: e.target.value,
                      })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="leadTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  納期
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="leadTime"
                    name="leadTime"
                    value={estimate.leadTime}
                    onChange={(e) =>
                      setEstimate({ ...estimate, leadTime: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  お支払方法
                </label>
                <div className="mt-1">
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={estimate.paymentMethod}
                    onChange={(e) =>
                      setEstimate({
                        ...estimate,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="銀行振込">銀行振込</option>
                    <option value="現金">現金</option>
                    <option value="クレジットカード">クレジットカード</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="validUntil"
                  className="block text-sm font-medium text-gray-700"
                >
                  有効期限
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="validUntil"
                    name="validUntil"
                    value={estimate.validUntil}
                    onChange={(e) =>
                      setEstimate({ ...estimate, validUntil: e.target.value })
                    }
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  商品明細
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
                      {estimate.items.map((item, index) => (
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
                          colSpan="4"
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
                    value={estimate.notes}
                    onChange={(e) =>
                      setEstimate({ ...estimate, notes: e.target.value })
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
