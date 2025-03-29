// app/lib/pdf.js
// PDF generation with Japanese text support using SVG-to-Image workaround

import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Function to generate a PDF for estimates
export const generateEstimatePDF = (estimateData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      compress: true,
    });

    // Helper function to add Japanese text to PDF by converting to image
    const addJapaneseText = (text, x, y, options = {}) => {
      return new Promise((resolve) => {
        // Use default options if not provided
        const fontSize = options.fontSize || 10;
        const fontWeight = options.fontWeight || "normal";
        const textAlign = options.align || "left";

        // Create SVG element
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "1000");
        svg.setAttribute("height", "100");

        const textElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textElement.setAttribute("x", "0");
        textElement.setAttribute("y", "30");
        textElement.setAttribute(
          "font-family",
          "'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif"
        );
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("font-weight", fontWeight);
        textElement.textContent = text;

        svg.appendChild(textElement);

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        const DOMURL = window.URL || window.webkitURL || window;
        const img = new Image();
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          DOMURL.revokeObjectURL(url);

          let imgWidth =
            textElement.getComputedTextLength() || text.length * fontSize * 0.6;
          if (imgWidth < 5) imgWidth = text.length * fontSize * 0.6; // Fallback calculation if getComputedTextLength is 0

          const imgHeight = fontSize * 1.2;

          // Calculate position adjustments for text alignment
          let xPos = x;
          if (textAlign === "center") {
            xPos = x - imgWidth / 2;
          } else if (textAlign === "right") {
            xPos = x - imgWidth;
          }

          const imgData = canvas.toDataURL("image/png");
          doc.addImage(
            imgData,
            "PNG",
            xPos,
            y - imgHeight * 0.8,
            imgWidth,
            imgHeight
          );
          resolve();
        };

        img.src = url;
      });
    };

    // Function to wait for all promises to complete
    const addAllText = async () => {
      // Add serial number for tracking
      const serialNumber = `PDF-${Date.now()}`;

      // --- HEADER ---
      await addJapaneseText("平田トレーディング", 20, 20, {
        fontSize: 16,
        fontWeight: "bold",
      });

      doc.setFontSize(10); // For non-Japanese text
      doc.text("123-4567", 20, 28);
      await addJapaneseText("東京都", 20, 33);
      doc.text("TEL: 03-1234-5678", 20, 38);

      // Document title
      await addJapaneseText("見積書", 105, 25, {
        fontSize: 16,
        fontWeight: "bold",
        align: "center",
      });

      // Date and document number
      await addJapaneseText(`日付: ${estimateData.date}`, 190, 20, {
        align: "right",
      });
      doc.text(`No: ${estimateData.estimateNumber}`, 190, 25, {
        align: "right",
      });
      doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

      // --- CLIENT INFO ---
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 45, 170, 25, "F");

      await addJapaneseText(
        `顧客: ${estimateData.clientName || "顧客名"}`,
        25,
        55,
        { fontSize: 12 }
      );
      if (estimateData.clientAddress) {
        await addJapaneseText(`住所: ${estimateData.clientAddress}`, 25, 62);
      }

      // --- TABLE HEADER ---
      let yPos = 80;

      // Draw table header
      doc.setFillColor(220, 220, 240);
      doc.rect(20, yPos, 170, 10, "F");
      doc.setDrawColor(100, 100, 100);

      // Table headers
      await addJapaneseText("商品", 25, yPos + 7);
      await addJapaneseText("数量", 95, yPos + 7);
      await addJapaneseText("単位", 115, yPos + 7);
      await addJapaneseText("単価", 135, yPos + 7);
      await addJapaneseText("金額", 175, yPos + 7, { align: "right" });

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

      for (let i = 0; i < estimateData.items.length; i++) {
        const item = estimateData.items[i];
        if (
          item.productName ||
          (item.quantity && parseFloat(item.quantity) > 0)
        ) {
          // Product name
          if (item.productName) {
            await addJapaneseText(item.productName, 25, yPos);
          }

          // Quantity
          const qty = item.quantity ? parseFloat(item.quantity) : 0;
          doc.text(qty.toString(), 95, yPos);

          // Unit
          if (item.unit) {
            await addJapaneseText(item.unit, 115, yPos);
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

      // --- TOTAL ---
      yPos = 190;
      doc.setLineWidth(0.5);
      doc.line(130, yPos, 190, yPos);

      await addJapaneseText("合計金額:", 130, yPos + 8, { fontSize: 12 });
      await addJapaneseText(
        `${totalAmount.toLocaleString()} 円`,
        190,
        yPos + 8,
        {
          fontSize: 12,
          align: "right",
        }
      );

      // --- NOTES ---
      if (estimateData.notes) {
        yPos += 15;
        await addJapaneseText("備考:", 20, yPos);
        await addJapaneseText(estimateData.notes, 20, yPos + 7);
      }

      // --- FOOTER ---
      yPos = 260;
      await addJapaneseText(
        `支払方法: ${estimateData.paymentMethod}`,
        20,
        yPos
      );
      await addJapaneseText(`納期: ${estimateData.leadTime}`, 20, yPos + 5);

      if (estimateData.deliveryLocation) {
        await addJapaneseText(
          `納品先: ${estimateData.deliveryLocation}`,
          20,
          yPos + 10
        );
      }

      // Add company seal placeholder
      doc.circle(170, yPos, 12, "S");
      await addJapaneseText("印", 170, yPos, { align: "center" });

      // Add document ID
      doc.setFontSize(6);
      await addJapaneseText(`文書ID: ${serialNumber}`, 105, 285, {
        fontSize: 6,
        align: "center",
      });

      return doc.output("dataurlstring");
    };

    // Execute all text additions and return the PDF
    return addAllText();
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

// Function to generate a PDF for orders
export const generateOrderPDF = (orderData) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      compress: true,
    });

    // Helper function to add Japanese text to PDF by converting to image
    const addJapaneseText = (text, x, y, options = {}) => {
      return new Promise((resolve) => {
        // Use default options if not provided
        const fontSize = options.fontSize || 10;
        const fontWeight = options.fontWeight || "normal";
        const textAlign = options.align || "left";

        // Create SVG element
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "1000");
        svg.setAttribute("height", "100");

        const textElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textElement.setAttribute("x", "0");
        textElement.setAttribute("y", "30");
        textElement.setAttribute(
          "font-family",
          "'Noto Sans JP', 'Hiragino Sans', 'Meiryo', sans-serif"
        );
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("font-weight", fontWeight);
        textElement.textContent = text;

        svg.appendChild(textElement);

        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        const DOMURL = window.URL || window.webkitURL || window;
        const img = new Image();
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = function () {
          ctx.drawImage(img, 0, 0);
          DOMURL.revokeObjectURL(url);

          let imgWidth =
            textElement.getComputedTextLength() || text.length * fontSize * 0.6;
          if (imgWidth < 5) imgWidth = text.length * fontSize * 0.6; // Fallback calculation if getComputedTextLength is 0

          const imgHeight = fontSize * 1.2;

          // Calculate position adjustments for text alignment
          let xPos = x;
          if (textAlign === "center") {
            xPos = x - imgWidth / 2;
          } else if (textAlign === "right") {
            xPos = x - imgWidth;
          }

          const imgData = canvas.toDataURL("image/png");
          doc.addImage(
            imgData,
            "PNG",
            xPos,
            y - imgHeight * 0.8,
            imgWidth,
            imgHeight
          );
          resolve();
        };

        img.src = url;
      });
    };

    // Function to wait for all promises to complete
    const addAllText = async () => {
      // Add serial number for tracking
      const serialNumber = `ORD-${Date.now()}`;

      // --- HEADER ---
      await addJapaneseText("平田トレーディング", 20, 20, {
        fontSize: 16,
        fontWeight: "bold",
      });

      doc.setFontSize(10); // For non-Japanese text
      doc.text("123-4567", 20, 28);
      await addJapaneseText("東京都", 20, 33);
      doc.text("TEL: 03-1234-5678", 20, 38);

      // Document title
      await addJapaneseText("発注書", 105, 25, {
        fontSize: 16,
        fontWeight: "bold",
        align: "center",
      });

      // Date and document number
      await addJapaneseText(`日付: ${orderData.date}`, 190, 20, {
        align: "right",
      });
      doc.text(`No: ${orderData.orderNumber}`, 190, 25, { align: "right" });
      doc.text(`ID: ${serialNumber}`, 190, 30, { align: "right" });

      // --- SUPPLIER INFO ---
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 45, 170, 25, "F");

      await addJapaneseText(
        `サプライヤー: ${orderData.supplierName || "サプライヤー名"}`,
        25,
        55,
        { fontSize: 12 }
      );
      if (orderData.supplierAddress) {
        await addJapaneseText(`住所: ${orderData.supplierAddress}`, 25, 62);
      }

      // --- TABLE HEADER ---
      let yPos = 80;

      // Draw table header
      doc.setFillColor(220, 220, 240);
      doc.rect(20, yPos, 170, 10, "F");
      doc.setDrawColor(100, 100, 100);

      // Table headers
      await addJapaneseText("商品", 25, yPos + 7);
      await addJapaneseText("コード", 85, yPos + 7);
      await addJapaneseText("数量", 105, yPos + 7);
      await addJapaneseText("単位", 120, yPos + 7);
      await addJapaneseText("単価", 140, yPos + 7);
      await addJapaneseText("金額", 175, yPos + 7, { align: "right" });

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

      for (let i = 0; i < orderData.items.length; i++) {
        const item = orderData.items[i];
        if (
          item.productName ||
          (item.quantity && parseFloat(item.quantity) > 0)
        ) {
          // Product name
          if (item.productName) {
            await addJapaneseText(item.productName, 25, yPos);
          }

          // Product code
          if (item.productCode) {
            doc.text(item.productCode, 85, yPos);
          }

          // Quantity
          const qty = item.quantity ? parseFloat(item.quantity) : 0;
          doc.text(qty.toString(), 105, yPos);

          // Unit
          if (item.unit) {
            await addJapaneseText(item.unit, 120, yPos);
          }

          // Unit price
          const unitPrice = item.unitPrice ? parseFloat(item.unitPrice) : 0;
          doc.text(unitPrice.toLocaleString(), 140, yPos);

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

      // --- TOTAL ---
      yPos = 190;
      doc.setLineWidth(0.5);
      doc.line(130, yPos, 190, yPos);

      await addJapaneseText("合計金額:", 130, yPos + 8, { fontSize: 12 });
      await addJapaneseText(
        `${totalAmount.toLocaleString()} 円`,
        190,
        yPos + 8,
        {
          fontSize: 12,
          align: "right",
        }
      );

      // --- NOTES ---
      if (orderData.notes) {
        yPos += 15;
        await addJapaneseText("備考:", 20, yPos);
        await addJapaneseText(orderData.notes, 20, yPos + 7);
      }

      // --- FOOTER ---
      yPos = 260;
      await addJapaneseText(`支払方法: ${orderData.paymentMethod}`, 20, yPos);

      if (orderData.requestedDeliveryDate) {
        await addJapaneseText(
          `希望納期: ${orderData.requestedDeliveryDate}`,
          20,
          yPos + 5
        );
      }

      if (orderData.deliveryLocation) {
        await addJapaneseText(
          `納品先: ${orderData.deliveryLocation}`,
          20,
          yPos + 10
        );
      }

      // Add company seal placeholder
      doc.circle(170, yPos, 12, "S");
      await addJapaneseText("印", 170, yPos, { align: "center" });

      // Add document ID
      doc.setFontSize(6);
      await addJapaneseText(`文書ID: ${serialNumber}`, 105, 285, {
        fontSize: 6,
        align: "center",
      });

      return doc.output("dataurlstring");
    };

    // Execute all text additions and return the PDF
    return addAllText();
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};
