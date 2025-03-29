// app/lib/pdf.js
// PDF generation with Japanese font support

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import NotoSansJP from "./fonts/NotoSansJP-Regular-base64";

// Function to generate a PDF for estimates
export const generateEstimatePDF = (estimateData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();

    // Register Japanese font
    doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.setFont("NotoSansJP");

    // Add serial number for tracking
    const serialNumber = `PDF-${Date.now()}`;

    // --- HEADER ---
    doc.setFontSize(16);
    doc.text("平田トレーディング", 20, 20);

    doc.setFontSize(10);
    doc.text("123-4567", 20, 28);
    doc.text("東京都", 20, 33);
    doc.text("TEL: 03-1234-5678", 20, 38);

    // Document title
    doc.setFontSize(16);
    doc.text("見積書", 105, 25, { align: "center" });

    // Date and document number
    doc.setFontSize(10);
    doc.text(`日付: ${estimateData.date}`, 190, 20, { align: "right" });
    doc.text(`No: ${estimateData.estimateNumber}`, 190, 25, { align: "right" });
    doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

    // --- CLIENT INFO ---
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 45, 170, 25, "F");

    doc.setFontSize(12);
    doc.text(`顧客: ${estimateData.clientName || "顧客名"}`, 25, 55);
    doc.setFontSize(10);
    if (estimateData.clientAddress) {
      doc.text(`住所: ${estimateData.clientAddress}`, 25, 62);
    }

    // --- TABLE HEADER ---
    let yPos = 80;

    // Draw table header
    doc.setFillColor(220, 220, 240);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setDrawColor(100, 100, 100);

    // Table headers
    doc.setFontSize(10);
    doc.text("商品", 25, yPos + 7);
    doc.text("数量", 95, yPos + 7);
    doc.text("単位", 115, yPos + 7);
    doc.text("単価", 135, yPos + 7);
    doc.text("金額", 175, yPos + 7, { align: "right" });

    // Draw table outline
    doc.rect(20, yPos, 170, 100);

    // Draw vertical lines
    doc.line(90, yPos, 90, yPos + 100);
    doc.line(110, yPos, 110, yPos + 100);
    doc.line(130, yPos, 130, yPos + 100);
    doc.line(160, yPos, 160, yPos + 100);

    // Draw horizontal line after header
    doc.line(20, yPos + 10, 190, yPos + 10);

    // --- TABLE ITEMS ---
    yPos += 15;
    const lineHeight = 10;
    let totalAmount = 0;

    estimateData.items.forEach((item, index) => {
      if (
        item.productName ||
        (item.quantity && parseFloat(item.quantity) > 0)
      ) {
        // Product name
        doc.text(item.productName || "", 25, yPos);

        // Quantity
        const qty = item.quantity ? parseFloat(item.quantity) : 0;
        doc.text(qty.toString(), 95, yPos);

        // Unit
        doc.text(item.unit || "", 115, yPos);

        // Unit price
        const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : 0;
        doc.text(unitPrice.toLocaleString(), 135, yPos);

        // Amount
        const amount = qty * unitPrice;
        doc.text(amount.toLocaleString(), 175, yPos, { align: "right" });

        totalAmount += amount;
        yPos += lineHeight;

        // Don't exceed page
        if (yPos > 170 && index < estimateData.items.length - 1) {
          doc.addPage();
          // Reset font for new page
          doc.setFont("NotoSansJP");
          yPos = 20;
        }
      }
    });

    // --- TOTAL ---
    yPos = 190;
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);

    doc.setFontSize(12);
    doc.text("合計金額:", 130, yPos + 8);
    doc.text(`${totalAmount.toLocaleString()} 円`, 190, yPos + 8, {
      align: "right",
    });

    // --- NOTES ---
    if (estimateData.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text("備考:", 20, yPos);
      doc.text(estimateData.notes, 20, yPos + 7);
    }

    // --- FOOTER ---
    yPos = 260;
    doc.setFontSize(9);
    doc.text(`支払方法: ${estimateData.paymentMethod}`, 20, yPos);
    doc.text(`納期: ${estimateData.leadTime}`, 20, yPos + 5);

    if (estimateData.deliveryLocation) {
      doc.text(`納品先: ${estimateData.deliveryLocation}`, 20, yPos + 10);
    }

    // Add company seal placeholder
    doc.circle(170, yPos, 12, "S");
    doc.text("印", 170, yPos, { align: "center" });

    // Add document ID
    doc.setFontSize(6);
    doc.text(`文書ID: ${serialNumber}`, 105, 285, { align: "center" });

    // Generate and return PDF as data URL
    return doc.output("dataurlstring");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

// Function to generate a PDF for orders
export const generateOrderPDF = (orderData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();

    // Register Japanese font
    doc.addFileToVFS("NotoSansJP-Regular.ttf", NotoSansJP);
    doc.addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
    doc.setFont("NotoSansJP");

    // Add serial number for tracking
    const serialNumber = `ORD-${Date.now()}`;

    // --- HEADER ---
    doc.setFontSize(16);
    doc.text("平田トレーディング", 20, 20);

    doc.setFontSize(10);
    doc.text("123-4567", 20, 28);
    doc.text("東京都", 20, 33);
    doc.text("TEL: 03-1234-5678", 20, 38);

    // Document title
    doc.setFontSize(16);
    doc.text("発注書", 105, 25, { align: "center" });

    // Date and document number
    doc.setFontSize(10);
    doc.text(`日付: ${orderData.date}`, 190, 20, { align: "right" });
    doc.text(`No: ${orderData.orderNumber}`, 190, 25, { align: "right" });
    doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

    // --- SUPPLIER INFO ---
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 45, 170, 25, "F");

    doc.setFontSize(12);
    doc.text(
      `サプライヤー: ${orderData.supplierName || "サプライヤー名"}`,
      25,
      55
    );
    doc.setFontSize(10);
    if (orderData.supplierAddress) {
      doc.text(`住所: ${orderData.supplierAddress}`, 25, 62);
    }

    // --- TABLE HEADER ---
    let yPos = 80;

    // Draw table header
    doc.setFillColor(220, 220, 240);
    doc.rect(20, yPos, 170, 10, "F");
    doc.setDrawColor(100, 100, 100);

    // Table headers
    doc.setFontSize(10);
    doc.text("商品", 25, yPos + 7);
    doc.text("コード", 85, yPos + 7);
    doc.text("数量", 105, yPos + 7);
    doc.text("単位", 120, yPos + 7);
    doc.text("単価", 140, yPos + 7);
    doc.text("金額", 175, yPos + 7, { align: "right" });

    // Draw table outline
    doc.rect(20, yPos, 170, 100);

    // Draw vertical lines
    doc.line(80, yPos, 80, yPos + 100);
    doc.line(100, yPos, 100, yPos + 100);
    doc.line(115, yPos, 115, yPos + 100);
    doc.line(135, yPos, 135, yPos + 100);
    doc.line(160, yPos, 160, yPos + 100);

    // Draw horizontal line after header
    doc.line(20, yPos + 10, 190, yPos + 10);

    // --- TABLE ITEMS ---
    yPos += 15;
    const lineHeight = 10;
    let totalAmount = 0;

    orderData.items.forEach((item, index) => {
      if (
        item.productName ||
        (item.quantity && parseFloat(item.quantity) > 0)
      ) {
        // Product name
        doc.text(item.productName || "", 25, yPos);

        // Product code
        doc.text(item.productCode || "", 85, yPos);

        // Quantity
        const qty = item.quantity ? parseFloat(item.quantity) : 0;
        doc.text(qty.toString(), 105, yPos);

        // Unit
        doc.text(item.unit || "", 120, yPos);

        // Unit price
        const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : 0;
        doc.text(unitPrice.toLocaleString(), 140, yPos);

        // Amount
        const amount = qty * unitPrice;
        doc.text(amount.toLocaleString(), 175, yPos, { align: "right" });

        totalAmount += amount;
        yPos += lineHeight;

        // Don't exceed page
        if (yPos > 170 && index < orderData.items.length - 1) {
          doc.addPage();
          // Reset font for new page
          doc.setFont("NotoSansJP");
          yPos = 20;
        }
      }
    });

    // --- TOTAL ---
    yPos = 190;
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);

    doc.setFontSize(12);
    doc.text("合計金額:", 130, yPos + 8);
    doc.text(`${totalAmount.toLocaleString()} 円`, 190, yPos + 8, {
      align: "right",
    });

    // --- NOTES ---
    if (orderData.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text("備考:", 20, yPos);
      doc.text(orderData.notes, 20, yPos + 7);
    }

    // --- FOOTER ---
    yPos = 260;
    doc.setFontSize(9);
    doc.text(`支払方法: ${orderData.paymentMethod}`, 20, yPos);

    if (orderData.requestedDeliveryDate) {
      doc.text(`希望納期: ${orderData.requestedDeliveryDate}`, 20, yPos + 5);
    }

    if (orderData.deliveryLocation) {
      doc.text(`納品先: ${orderData.deliveryLocation}`, 20, yPos + 10);
    }

    // Add company seal placeholder
    doc.circle(170, yPos, 12, "S");
    doc.text("印", 170, yPos, { align: "center" });

    // Add document ID
    doc.setFontSize(6);
    doc.text(`文書ID: ${serialNumber}`, 105, 285, { align: "center" });

    // Generate and return PDF as data URL
    return doc.output("dataurlstring");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};
