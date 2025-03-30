"use client";

import { useState } from "react";
import PDFViewer from "./PDFViewer";
import { generateOrderPDF } from "@/app/lib/puppeteer-pdf";

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
    deliveryLocation: "Hirata Trading Head Office",
    requestedDeliveryDate: "",
    paymentMethod: "Bank Transfer",
    items: Array(10)
      .fill()
      .map(() => ({
        productName: "",
        productCode: "",
        quantity: "",
        unit: "pcs",
        unitPrice: "",
        amount: 0,
      })),
    notes: "",
  });

  // Calculate item amount when quantity or unitPrice changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...order.items];

    if (field === "quantity" || field === "unitPrice") {
      // Remove leading zeros for numeric inputs
      const cleanedValue = value.toString().replace(/^0+/, "") || "";

      // Only allow numbers
      if (/^\d*$/.test(cleanedValue)) {
        newItems[index][field] = cleanedValue;

        // Calculate amount
        const quantity = parseFloat(newItems[index].quantity) || 0;
        const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
        newItems[index].amount = quantity * unitPrice;
      }
    } else {
      newItems[index][field] = value;
    }

    setOrder({ ...order, items: newItems });
  };

  // Calculate total amount
  const totalAmount = order.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Generate PDF
  const generatePDF = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call the PDF generation function
      const pdfDataUrl = await generateOrderPDF(order);

      // Set the PDF URL for the viewer
      setPdfUrl(pdfDataUrl);
      setShowPdfViewer(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={generatePDF}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
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
                  Order Number
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
                  Supplier Name
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
                  Supplier Address
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
                  Delivery Location
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
                  Requested Delivery Date
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
                    placeholder="e.g. 2025/04/15"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Method
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
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Invoice (30 days)">Invoice (30 days)</option>
                    <option value="Invoice (60 days)">Invoice (60 days)</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Order Items
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Unit
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Unit Price ($)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount ($)
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
                              type="text"
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
                              <option value="pcs">pcs</option>
                              <option value="box">box</option>
                              <option value="set">set</option>
                              <option value="kg">kg</option>
                              <option value="m">m</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
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
                          Total Amount
                        </td>
                        <td className="px-6 py-4 text-right font-semibold">
                          {totalAmount.toLocaleString()} $
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
                  Notes
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
                {loading ? "Generating PDF..." : "Generate PDF"}
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
