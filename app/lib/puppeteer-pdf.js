// app/lib/puppeteer-pdf.js
// Improved version with better error handling and browser management

const puppeteer = require("puppeteer");

/**
 * Generate a PDF for an estimate
 * @param {Object} estimateData - The estimate data to generate PDF from
 * @returns {Promise<string>} - The PDF data URL
 */
exports.generateEstimatePDF = async (estimateData) => {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "estimate",
        ...estimateData,
      }),
    });

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "PDF generation failed");
    }

    // Convert base64 to data URL
    return `data:application/pdf;base64,${result.data}`;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};

/**
 * Generate a PDF for an order
 * @param {Object} orderData - The order data to generate PDF from
 * @returns {Promise<string>} - The PDF data URL
 */
exports.generateOrderPDF = async (orderData) => {
  try {
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "order",
        ...orderData,
      }),
    });

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "PDF generation failed");
    }

    // Convert base64 to data URL
    return `data:application/pdf;base64,${result.data}`;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};
