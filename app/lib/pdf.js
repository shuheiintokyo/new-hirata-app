// app/lib/pdf.js - Simplified version without Japanese font handling

// Function to generate a PDF for estimates
export const generateEstimatePDF = async (estimateData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add company info
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Hirata Trading", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123-4567 Tokyo", 20, 28);
    doc.text("TEL: 03-1234-5678", 20, 33);

    // Document title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ESTIMATE", 105, 25, { align: "center" });

    // Date and document number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${estimateData.date}`, 190, 20, { align: "right" });
    doc.text(`No: ${estimateData.estimateNumber}`, 190, 25, { align: "right" });

    // Generate serial number for tracking
    const serialNumber = `EST-${Date.now()}`;
    doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

    // Client info box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 45, 170, 25, "F");
    doc.text(`Client: ${estimateData.clientName || "Client Name"}`, 25, 55);
    if (estimateData.clientAddress) {
      doc.text(`Address: ${estimateData.clientAddress}`, 25, 62);
    }

    // Table header
    let yPos = 80;
    doc.setFillColor(220, 220, 240);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setDrawColor(100, 100, 100);

    // Table headers
    doc.text("Product", 25, yPos + 7);
    doc.text("Quantity", 95, yPos + 7);
    doc.text("Unit", 115, yPos + 7);
    doc.text("Unit Price", 135, yPos + 7);
    doc.text("Amount", 175, yPos + 7, { align: "right" });

    // Draw table outline
    doc.rect(20, yPos, 170, 100);

    // Draw vertical lines
    doc.line(90, yPos, 90, yPos + 100);
    doc.line(110, yPos, 110, yPos + 100);
    doc.line(130, yPos, 130, yPos + 100);
    doc.line(160, yPos, 160, yPos + 100);

    // Draw horizontal line after header
    doc.line(20, yPos + 10, 190, yPos + 10);

    // Table items
    yPos += 15;
    const lineHeight = 10;
    let totalAmount = 0;

    for (let i = 0; i < estimateData.items.length; i++) {
      const item = estimateData.items[i];
      if (
        item.productName ||
        (item.quantity && parseFloat(item.quantity) > 0)
      ) {
        // Product name
        if (item.productName) {
          doc.text(item.productName, 25, yPos);
        }

        // Quantity
        const qty = item.quantity ? parseFloat(item.quantity) : 0;
        doc.text(qty.toString(), 95, yPos);

        // Unit
        if (item.unit) {
          doc.text(item.unit, 115, yPos);
        }

        // Unit price
        const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : 0;
        doc.text(unitPrice.toLocaleString(), 135, yPos);

        // Amount
        const amount = qty * unitPrice;
        doc.text(amount.toLocaleString(), 175, yPos, { align: "right" });

        totalAmount += amount;
        yPos += lineHeight;

        // Don't exceed page
        if (yPos > 170 && i < estimateData.items.length - 1) {
          doc.addPage();
          yPos = 20;
        }
      }
    }

    // Total
    yPos = 190;
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);

    doc.setFontSize(12);
    doc.text("Total Amount:", 130, yPos + 8);
    doc.text(`${totalAmount.toLocaleString()} $`, 190, yPos + 8, {
      align: "right",
    });

    // Notes
    if (estimateData.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text("Notes:", 20, yPos);
      doc.text(estimateData.notes, 20, yPos + 7);
    }

    // Footer
    yPos = 260;
    doc.text(`Payment Method: ${estimateData.paymentMethod}`, 20, yPos);
    doc.text(`Delivery Time: ${estimateData.leadTime}`, 20, yPos + 5);

    if (estimateData.deliveryLocation) {
      doc.text(
        `Delivery Location: ${estimateData.deliveryLocation}`,
        20,
        yPos + 10
      );
    }

    // Company seal placeholder
    doc.circle(170, yPos, 12, "S");
    doc.text("SEAL", 170, yPos, { align: "center" });

    // Document ID for reference
    doc.setFontSize(6);
    doc.text(`Document ID: ${serialNumber}`, 105, 285, { align: "center" });

    // Generate PDF data URL and return it
    return doc.output("dataurlstring");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

// Function to generate a PDF for orders (similar structure to estimates)
export const generateOrderPDF = async (orderData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add company info
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Hirata Trading", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123-4567 Tokyo", 20, 28);
    doc.text("TEL: 03-1234-5678", 20, 33);

    // Document title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PURCHASE ORDER", 105, 25, { align: "center" });

    // Date and document number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${orderData.date}`, 190, 20, { align: "right" });
    doc.text(`No: ${orderData.orderNumber}`, 190, 25, { align: "right" });

    // Generate serial number for tracking
    const serialNumber = `ORD-${Date.now()}`;
    doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

    // Supplier info box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 45, 170, 25, "F");
    doc.text(`Supplier: ${orderData.supplierName || "Supplier Name"}`, 25, 55);
    if (orderData.supplierAddress) {
      doc.text(`Address: ${orderData.supplierAddress}`, 25, 62);
    }

    // Table header
    let yPos = 80;
    doc.setFillColor(220, 220, 240);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setDrawColor(100, 100, 100);

    // Table headers
    doc.text("Product", 25, yPos + 7);
    doc.text("Product Code", 80, yPos + 7);
    doc.text("Qty", 120, yPos + 7);
    doc.text("Unit", 135, yPos + 7);
    doc.text("Unit Price", 150, yPos + 7);
    doc.text("Amount", 175, yPos + 7, { align: "right" });

    // Draw table outline
    doc.rect(20, yPos, 170, 100);

    // Draw vertical lines
    doc.line(75, yPos, 75, yPos + 100);
    doc.line(115, yPos, 115, yPos + 100);
    doc.line(130, yPos, 130, yPos + 100);
    doc.line(145, yPos, 145, yPos + 100);
    doc.line(160, yPos, 160, yPos + 100);

    // Draw horizontal line after header
    doc.line(20, yPos + 10, 190, yPos + 10);

    // Table items
    yPos += 15;
    const lineHeight = 10;
    let totalAmount = 0;

    for (let i = 0; i < orderData.items.length; i++) {
      const item = orderData.items[i];
      if (
        item.productName ||
        (item.quantity && parseFloat(item.quantity) > 0)
      ) {
        // Product name
        if (item.productName) {
          doc.text(item.productName, 25, yPos);
        }

        // Product code
        if (item.productCode) {
          doc.text(item.productCode, 80, yPos);
        }

        // Quantity
        const qty = item.quantity ? parseFloat(item.quantity) : 0;
        doc.text(qty.toString(), 120, yPos);

        // Unit
        if (item.unit) {
          doc.text(item.unit, 135, yPos);
        }

        // Unit price
        const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : 0;
        doc.text(unitPrice.toLocaleString(), 150, yPos);

        // Amount
        const amount = qty * unitPrice;
        doc.text(amount.toLocaleString(), 175, yPos, { align: "right" });

        totalAmount += amount;
        yPos += lineHeight;

        // Don't exceed page
        if (yPos > 170 && i < orderData.items.length - 1) {
          doc.addPage();
          yPos = 20;
        }
      }
    }

    // Total
    yPos = 190;
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);

    doc.setFontSize(12);
    doc.text("Total Amount:", 130, yPos + 8);
    doc.text(`${totalAmount.toLocaleString()} $`, 190, yPos + 8, {
      align: "right",
    });

    // Notes
    if (orderData.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text("Notes:", 20, yPos);
      doc.text(orderData.notes, 20, yPos + 7);
    }

    // Footer
    yPos = 260;
    doc.text(`Payment Method: ${orderData.paymentMethod}`, 20, yPos);
    doc.text(
      `Requested Delivery Date: ${orderData.requestedDeliveryDate || "TBD"}`,
      20,
      yPos + 5
    );

    if (orderData.deliveryLocation) {
      doc.text(
        `Delivery Location: ${orderData.deliveryLocation}`,
        20,
        yPos + 10
      );
    }

    // Company seal placeholder
    doc.circle(170, yPos, 12, "S");
    doc.text("SEAL", 170, yPos, { align: "center" });

    // Document ID for reference
    doc.setFontSize(6);
    doc.text(`Document ID: ${serialNumber}`, 105, 285, { align: "center" });

    // Generate PDF data URL and return it
    return doc.output("dataurlstring");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};
