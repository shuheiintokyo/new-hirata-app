// app/lib/puppeteer-pdf.js
// Client-side code that only uses fetch

/**
 * Generate a PDF for an estimate
 * @param {Object} estimateData - The estimate data to generate PDF from
 * @returns {Promise<string>} - The PDF data URL
 */
exports.generateEstimatePDF = async (estimateData) => {
  try {
    console.log("Starting estimate PDF generation request");
    const response = await fetch(`${window.location.origin}/api/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "estimate",
        ...estimateData,
      }),
    });

    console.log("Response status:", response.status);
    const result = await response.json();
    console.log("Response received:", result);

    if (!response.ok || !result.success) {
      const errorMessage = result.error || "PDF generation failed";
      console.error("PDF generation error:", errorMessage);
      if (result.stack) {
        console.error("Error stack:", result.stack);
      }
      throw new Error(errorMessage);
    }

    // Validate PDF data
    if (!result.data || typeof result.data !== "string") {
      throw new Error("Invalid PDF data received from server");
    }

    console.log("PDF generated successfully");
    return `data:${result.contentType || "application/pdf"};base64,${
      result.data
    }`;
  } catch (error) {
    console.error("Client-side PDF generation error:", error);
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
    console.log("Starting order PDF generation request");
    const response = await fetch(`${window.location.origin}/api/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "order",
        ...orderData,
      }),
    });

    console.log("Response status:", response.status);
    const result = await response.json();
    console.log("Response received:", result);

    if (!response.ok || !result.success) {
      const errorMessage = result.error || "PDF generation failed";
      console.error("PDF generation error:", errorMessage);
      if (result.stack) {
        console.error("Error stack:", result.stack);
      }
      throw new Error(errorMessage);
    }

    // Validate PDF data
    if (!result.data || typeof result.data !== "string") {
      throw new Error("Invalid PDF data received from server");
    }

    console.log("PDF generated successfully");
    return `data:${result.contentType || "application/pdf"};base64,${
      result.data
    }`;
  } catch (error) {
    console.error("Client-side PDF generation error:", error);
    throw error;
  }
};
