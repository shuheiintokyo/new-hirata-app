// PDF Generation utility using jsPDF
// In a real application, you would use a library like jsPDF or generate PDFs on the server
import jsPDF from "jspdf";
import "jspdf-autotable";

// Helper to format numbers with commas as thousands separators
const formatNumber = (num) => {
  return num.toLocaleString("ja-JP");
};

// Generate Estimate PDF
export const generateEstimatePDF = (estimate) => {
  const doc = new jsPDF();

  // Add Japanese font support
  // In a real implementation, you would need to add proper Japanese font support
  // This is a simplified version for demonstration

  // Set document properties
  doc.setProperties({
    title: `見積書_${estimate.estimateNumber}`,
    subject: `${estimate.clientName}様向け見積書`,
    author: "平田トレーディング",
    keywords: "見積書, 平田トレーディング",
    creator: "平田トレーディング見積システム",
  });

  // Add document title
  doc.setFontSize(24);
  doc.text("見積書", 105, 20, { align: "center" });

  // Add estimate number
  doc.setFontSize(10);
  doc.text(`No. ${estimate.estimateNumber}`, 200, 20, { align: "right" });

  // Add date
  doc.setFontSize(10);
  doc.text(`日付: ${estimate.date}`, 200, 30, { align: "right" });

  // Add client info
  doc.setFontSize(12);
  doc.text(`${estimate.clientName} 御中`, 20, 40);
  doc.setFontSize(10);
  doc.text(estimate.clientAddress, 20, 47);

  // Add company info
  doc.setFontSize(14);
  doc.text("平田トレーディング株式会社", 200, 45, { align: "right" });
  doc.setFontSize(10);
  doc.text("〒123-4567", 200, 52, { align: "right" });
  doc.text("東京都港区赤坂1-2-3", 200, 59, { align: "right" });
  doc.text("TEL: 03-1234-5678", 200, 66, { align: "right" });
  doc.text("FAX: 03-1234-5679", 200, 73, { align: "right" });

  // Add estimate details
  doc.setFontSize(10);
  doc.text(`納品場所: ${estimate.deliveryLocation}`, 20, 90);
  doc.text(`納期: ${estimate.leadTime}`, 20, 97);
  doc.text(`お支払方法: ${estimate.paymentMethod}`, 20, 104);
  doc.text(`有効期限: ${estimate.validUntil}`, 20, 111);

  // Add estimate total amount
  const totalAmount = estimate.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  doc.setFontSize(14);
  doc.text(`合計金額: ${formatNumber(totalAmount)} 円 (税抜)`, 200, 90, {
    align: "right",
  });

  // Generate table with items
  const tableColumn = ["商品名", "数量", "単位", "単価 (円)", "金額 (円)"];

  // Filter out empty rows (where productName is empty)
  const validItems = estimate.items.filter(
    (item) => item.productName.trim() !== ""
  );

  const tableRows = validItems.map((item) => [
    item.productName,
    item.quantity,
    item.unit,
    formatNumber(item.unitPrice),
    formatNumber(item.amount),
  ]);

  // Add items table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 120,
    margin: { top: 120 },
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 80 }, // Product name
      1: { cellWidth: 20, halign: "center" }, // Quantity
      2: { cellWidth: 20, halign: "center" }, // Unit
      3: { cellWidth: 30, halign: "right" }, // Unit price
      4: { cellWidth: 40, halign: "right" }, // Amount
    },
  });

  // Add notes section
  if (estimate.notes) {
    const finalY = doc.autoTable.previous.finalY || 120;
    doc.setFontSize(12);
    doc.text("備考:", 20, finalY + 20);
    doc.setFontSize(10);

    // Split notes into multiple lines if necessary
    const splitNotes = doc.splitTextToSize(estimate.notes, 170);
    doc.text(splitNotes, 20, finalY + 30);
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      "この見積書に関するお問い合わせは、上記連絡先までお願い致します。",
      105,
      285,
      { align: "center" }
    );
    doc.text(`${i} / ${pageCount}`, 195, 285);
  }

  return doc;
};

// Generate Supplier Order PDF
export const generateOrderPDF = (order) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: `発注書_${order.orderNumber}`,
    subject: `${order.supplierName}様向け発注書`,
    author: "平田トレーディング",
    keywords: "発注書, 平田トレーディング",
    creator: "平田トレーディング発注システム",
  });

  // Add document title
  doc.setFontSize(24);
  doc.text("発注書", 105, 20, { align: "center" });

  // Add order number
  doc.setFontSize(10);
  doc.text(`No. ${order.orderNumber}`, 200, 20, { align: "right" });

  // Add date
  doc.setFontSize(10);
  doc.text(`日付: ${order.date}`, 200, 30, { align: "right" });

  // Add supplier info
  doc.setFontSize(12);
  doc.text(`${order.supplierName} 御中`, 20, 40);
  doc.setFontSize(10);
  doc.text(order.supplierAddress, 20, 47);

  // Add company info
  doc.setFontSize(14);
  doc.text("平田トレーディング株式会社", 200, 45, { align: "right" });
  doc.setFontSize(10);
  doc.text("〒123-4567", 200, 52, { align: "right" });
  doc.text("東京都港区赤坂1-2-3", 200, 59, { align: "right" });
  doc.text("TEL: 03-1234-5678", 200, 66, { align: "right" });
  doc.text("FAX: 03-1234-5679", 200, 73, { align: "right" });

  // Add order details
  doc.setFontSize(10);
  doc.text(`納品場所: ${order.deliveryLocation}`, 20, 90);
  doc.text(`希望納期: ${order.requestedDeliveryDate || "指定なし"}`, 20, 97);
  doc.text(`お支払方法: ${order.paymentMethod}`, 20, 104);

  // Add order total amount
  const totalAmount = order.items.reduce((sum, item) => sum + item.amount, 0);
  doc.setFontSize(14);
  doc.text(`合計金額: ${formatNumber(totalAmount)} 円 (税抜)`, 200, 90, {
    align: "right",
  });

  // Generate table with items
  const tableColumn = [
    "商品名",
    "商品コード",
    "数量",
    "単位",
    "単価 (円)",
    "金額 (円)",
  ];

  // Filter out empty rows (where productName is empty)
  const validItems = order.items.filter(
    (item) => item.productName.trim() !== ""
  );

  const tableRows = validItems.map((item) => [
    item.productName,
    item.productCode,
    item.quantity,
    item.unit,
    formatNumber(item.unitPrice),
    formatNumber(item.amount),
  ]);

  // Add items table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 120,
    margin: { top: 120 },
    theme: "grid",
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Product name
      1: { cellWidth: 30 }, // Product code
      2: { cellWidth: 15, halign: "center" }, // Quantity
      3: { cellWidth: 15, halign: "center" }, // Unit
      4: { cellWidth: 30, halign: "right" }, // Unit price
      5: { cellWidth: 30, halign: "right" }, // Amount
    },
  });

  // Add notes section
  if (order.notes) {
    const finalY = doc.autoTable.previous.finalY || 120;
    doc.setFontSize(12);
    doc.text("備考:", 20, finalY + 20);
    doc.setFontSize(10);

    // Split notes into multiple lines if necessary
    const splitNotes = doc.splitTextToSize(order.notes, 170);
    doc.text(splitNotes, 20, finalY + 30);
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      "この発注書に関するお問い合わせは、上記連絡先までお願い致します。",
      105,
      285,
      { align: "center" }
    );
    doc.text(`${i} / ${pageCount}`, 195, 285);
  }

  return doc;
};

// Save PDF to file or open in new window
export const savePDF = (doc, filename) => {
  // In a real application, you would either:
  // 1. Save the file directly to the user's device
  // 2. Open the PDF in a new window
  // 3. Send it to a server for storage

  // For this demo, we'll just return the PDF as a data URL
  return doc.output("dataurlstring");
};
