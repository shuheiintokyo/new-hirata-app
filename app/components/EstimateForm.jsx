"use client";

import { useState } from "react";
import PDFViewer from "./PDFViewer";
import { generateEstimatePDF } from "../lib/puppeteer-pdf";

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
    leadTime: "2 weeks",
    paymentMethod: "Bank Transfer",
    validUntil: "30 days from issue date",
    items: Array(10)
      .fill()
      .map(() => ({
        productName: "",
        quantity: "", // Empty string instead of 0
        unit: "pcs",
        unitPrice: "", // Empty string instead of 0
        amount: 0,
      })),
    notes: "",
  });

  // Calculate item amount when quantity or unitPrice changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...estimate.items];

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

    setEstimate({ ...estimate, items: newItems });
  };

  // Calculate total amount
  const totalAmount = estimate.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Generate PDF using Puppeteer API
  const generatePDF = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the generateEstimatePDF function from puppeteer-pdf.js
      const pdfDataUrl = await generateEstimatePDF(estimate);

      // Set the PDF URL for the viewer
      setPdfUrl(pdfDataUrl);
      setShowPdfViewer(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
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
                  Estimate Number
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
                  Client Name
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
                  Client Address
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
                  Delivery Location
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
                  Delivery Time
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
                  Payment Method
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
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="validUntil"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valid Until
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
                  Product Details
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
                          colSpan="4"
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
