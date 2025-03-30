// app/lib/puppeteer-pdf.js
import puppeteer from "puppeteer";

/**
 * Generates a PDF using Puppeteer with HTML content
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {Object} options - PDF generation options
 * @returns {Promise<Buffer>} The PDF as a buffer
 */
export async function generatePDFFromHTML(htmlContent, options = {}) {
  // Launching Puppeteer in headless mode
  const browser = await puppeteer.launch({
    headless: "new", // Use the new headless mode
  });

  try {
    const page = await browser.newPage();

    // Set content and wait until network is idle
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1cm",
        right: "1cm",
        bottom: "1cm",
        left: "1cm",
      },
      ...options,
    });

    return pdfBuffer;
  } finally {
    // Always close the browser
    await browser.close();
  }
}

/**
 * Generates an estimate PDF using Puppeteer
 * @param {Object} estimateData - The estimate data
 * @returns {Promise<Buffer>} The PDF as a buffer
 */
export async function generateEstimatePDF(estimateData) {
  // Calculate the total amount
  const totalAmount = estimateData.items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0);

  // Generate HTML for the estimate
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>見積書 (Estimate)</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Noto Sans JP', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .document-title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        
        .company-info {
          margin-bottom: 20px;
        }
        
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .client-info {
          width: 60%;
        }
        
        .estimate-info {
          width: 35%;
          text-align: right;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        table th, table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        table th {
          background-color: #f2f2f2;
        }
        
        .amount-column {
          text-align: right;
        }
        
        .total-row {
          font-weight: bold;
        }
        
        .footer {
          margin-top: 30px;
        }
        
        .notes {
          margin: 20px 0;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 4px solid #ddd;
        }
        
        .seal {
          float: right;
          width: 100px;
          height: 100px;
          border: 2px solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 100px;
          margin-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Hirata Trading - 平田トレーディング</h1>
        <div class="document-title">見積書 (Estimate)</div>
      </div>
      
      <div class="info-section">
        <div class="client-info">
          <h3>お客様情報 (Client Information)</h3>
          <p><strong>お客様名 (Client):</strong> ${
            estimateData.clientName || "N/A"
          }</p>
          <p><strong>住所 (Address):</strong> ${
            estimateData.clientAddress || "N/A"
          }</p>
          <p><strong>納品先 (Delivery Location):</strong> ${
            estimateData.deliveryLocation || "N/A"
          }</p>
        </div>
        
        <div class="estimate-info">
          <p><strong>日付 (Date):</strong> ${estimateData.date}</p>
          <p><strong>見積番号 (No):</strong> ${estimateData.estimateNumber}</p>
          <p><strong>有効期限 (Valid Until):</strong> ${
            estimateData.validUntil
          }</p>
        </div>
      </div>
      
      <h3>製品明細 (Product Details)</h3>
      <table>
        <thead>
          <tr>
            <th>製品名 (Product)</th>
            <th>数量 (Quantity)</th>
            <th>単位 (Unit)</th>
            <th>単価 (Unit Price $)</th>
            <th>金額 (Amount $)</th>
          </tr>
        </thead>
        <tbody>
          ${estimateData.items
            .map((item, index) => {
              if (!item.productName && !parseFloat(item.quantity)) return "";
              const quantity = parseFloat(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const amount = quantity * unitPrice;

              return `
              <tr>
                <td>${item.productName || ""}</td>
                <td>${quantity}</td>
                <td>${item.unit || ""}</td>
                <td>${unitPrice.toLocaleString()}</td>
                <td class="amount-column">${amount.toLocaleString()}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="4" style="text-align: right;"><strong>合計 (Total)</strong></td>
            <td class="amount-column">${totalAmount.toLocaleString()} $</td>
          </tr>
        </tfoot>
      </table>
      
      ${
        estimateData.notes
          ? `
        <div class="notes">
          <h3>備考 (Notes)</h3>
          <p>${estimateData.notes}</p>
        </div>
      `
          : ""
      }
      
      <div class="footer">
        <div class="seal">印 (SEAL)</div>
        <p><strong>支払条件 (Payment Method):</strong> ${
          estimateData.paymentMethod || "N/A"
        }</p>
        <p><strong>納期 (Delivery Time):</strong> ${
          estimateData.leadTime || "N/A"
        }</p>
        <p>本見積書に関するご質問は下記までお問い合わせください。<br>
        (For questions regarding this estimate, please contact us below.)</p>
        <p>平田トレーディング株式会社<br>
        〒123-4567 東京都...<br>
        TEL: 03-1234-5678<br>
        Email: info@hirata-trading.example.com</p>
      </div>
    </body>
    </html>
  `;

  return await generatePDFFromHTML(htmlContent);
}

/**
 * Generates a purchase order PDF using Puppeteer
 * @param {Object} orderData - The order data
 * @returns {Promise<Buffer>} The PDF as a buffer
 */
export async function generateOrderPDF(orderData) {
  // Calculate the total amount
  const totalAmount = orderData.items.reduce((sum, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return sum + quantity * unitPrice;
  }, 0);

  // Generate HTML for the order
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>発注書 (Purchase Order)</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        
        body {
          font-family: 'Noto Sans JP', sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        
        .document-title {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }
        
        .company-info {
          margin-bottom: 20px;
        }
        
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .supplier-info {
          width: 60%;
        }
        
        .order-info {
          width: 35%;
          text-align: right;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        table th, table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        table th {
          background-color: #f2f2f2;
        }
        
        .amount-column {
          text-align: right;
        }
        
        .total-row {
          font-weight: bold;
        }
        
        .footer {
          margin-top: 30px;
        }
        
        .notes {
          margin: 20px 0;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 4px solid #ddd;
        }
        
        .seal {
          float: right;
          width: 100px;
          height: 100px;
          border: 2px solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 100px;
          margin-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Hirata Trading - 平田トレーディング</h1>
        <div class="document-title">発注書 (Purchase Order)</div>
      </div>
      
      <div class="info-section">
        <div class="supplier-info">
          <h3>サプライヤー情報 (Supplier Information)</h3>
          <p><strong>サプライヤー名 (Supplier):</strong> ${
            orderData.supplierName || "N/A"
          }</p>
          <p><strong>住所 (Address):</strong> ${
            orderData.supplierAddress || "N/A"
          }</p>
          <p><strong>納品先 (Delivery Location):</strong> ${
            orderData.deliveryLocation || "N/A"
          }</p>
        </div>
        
        <div class="order-info">
          <p><strong>日付 (Date):</strong> ${orderData.date}</p>
          <p><strong>発注番号 (No):</strong> ${orderData.orderNumber}</p>
          <p><strong>希望納期 (Requested Delivery):</strong> ${
            orderData.requestedDeliveryDate || "N/A"
          }</p>
        </div>
      </div>
      
      <h3>発注明細 (Order Details)</h3>
      <table>
        <thead>
          <tr>
            <th>製品名 (Product)</th>
            <th>製品コード (Code)</th>
            <th>数量 (Quantity)</th>
            <th>単位 (Unit)</th>
            <th>単価 (Unit Price $)</th>
            <th>金額 (Amount $)</th>
          </tr>
        </thead>
        <tbody>
          ${orderData.items
            .map((item, index) => {
              if (!item.productName && !parseFloat(item.quantity)) return "";
              const quantity = parseFloat(item.quantity) || 0;
              const unitPrice = parseFloat(item.unitPrice) || 0;
              const amount = quantity * unitPrice;

              return `
              <tr>
                <td>${item.productName || ""}</td>
                <td>${item.productCode || ""}</td>
                <td>${quantity}</td>
                <td>${item.unit || ""}</td>
                <td>${unitPrice.toLocaleString()}</td>
                <td class="amount-column">${amount.toLocaleString()}</td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="5" style="text-align: right;"><strong>合計 (Total)</strong></td>
            <td class="amount-column">${totalAmount.toLocaleString()} $</td>
          </tr>
        </tfoot>
      </table>
      
      ${
        orderData.notes
          ? `
        <div class="notes">
          <h3>備考 (Notes)</h3>
          <p>${orderData.notes}</p>
        </div>
      `
          : ""
      }
      
      <div class="footer">
        <div class="seal">印 (SEAL)</div>
        <p><strong>支払条件 (Payment Method):</strong> ${
          orderData.paymentMethod || "N/A"
        }</p>
        <p>本発注書に関するご質問は下記までお問い合わせください。<br>
        (For questions regarding this purchase order, please contact us below.)</p>
        <p>平田トレーディング株式会社<br>
        〒123-4567 東京都...<br>
        TEL: 03-1234-5678<br>
        Email: info@hirata-trading.example.com</p>
      </div>
    </body>
    </html>
  `;

  return await generatePDFFromHTML(htmlContent);
}
