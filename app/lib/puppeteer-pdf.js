// app/lib/puppeteer-pdf.js
// Improved version with better error handling and browser management

const puppeteer = require('puppeteer');

/**
 * Get a browser instance with properly configured launch options
 * @returns {Promise<Browser>} - Puppeteer browser instance
 */
async function getBrowserInstance() {
  try {
    return await puppeteer.launch({
      headless: "new", // Use the new headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas', 
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      ignoreHTTPSErrors: true,
      timeout: 60000, // Increase timeout to 60 seconds
    });
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw new Error(`Browser launch failed: ${error.message}`);
  }
}

/**
 * Generate a PDF for an estimate using Puppeteer
 * This properly handles Japanese text rendering with improved error handling
 * @param {Object} estimateData - The estimate data
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer for the PDF
 */
exports.generateEstimatePDF = async (estimateData) => {
  let browser = null;
  let page = null;
  
  try {
    console.log("Starting PDF generation for estimate...");
    browser = await getBrowserInstance();
    console.log("Browser launched successfully");

    // Create a new page
    page = await browser.newPage();
    console.log("New page created");

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });
    console.log("Viewport set");

    // Calculate totals
    const items = estimateData.items || [];
    const subtotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const taxRate = 0.1; // 10% tax
    const tax = Math.floor(subtotal * taxRate);
    const total = subtotal + tax;
    console.log("Calculations completed");

    // Generate HTML template with proper Japanese fonts
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>見積書</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          
          body {
            font-family: 'Noto Sans JP', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 11px;
            background-color: #ffffff;
          }
          
          .document {
            max-width: 210mm;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          .document-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000000;
          }
          
          .title-underline {
            width: 50mm;
            height: 1px;
            background-color: #000;
            margin: 0 auto 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .stamp-area {
            border: 1px solid #999;
            width: 25mm;
            height: 25mm;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            margin-left: auto;
            background-color: #ffffff;
          }
          
          .client-info {
            border: 1px solid #ccc;
            background-color: #f5f5f5;
            padding: 10px;
            width: 40%;
          }
          
          .client-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .document-info {
            margin-bottom: 10px;
          }
          
          .total-box {
            border: 1px solid #000;
            background-color: #f5f5f5;
            padding: 10px;
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .total-label {
            font-size: 14px;
            font-weight: bold;
          }
          
          .total-value {
            font-size: 16px;
            font-weight: bold;
          }
          
          .info-section {
            background-color: #f5f5f5;
            padding: 10px;
            margin: 15px 0;
            border-left: 3px solid #333;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .info-item label {
            font-weight: bold;
            margin-right: 5px;
          }
          
          .message {
            margin: 15px 0;
            line-height: 1.5;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          th {
            background-color: #333;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: normal;
          }
          
          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          
          tr:nth-child(even) td {
            background-color: #f5f5f5;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .notes {
            margin-top: 20px;
          }
          
          .notes-title {
            font-weight: bold;
            border-bottom: 1px solid #333;
            display: inline-block;
            margin-bottom: 5px;
          }
          
          .notes-content {
            white-space: pre-line;
            line-height: 1.5;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: #ffffff;
            }
            
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="document-title">見積書</div>
          <div class="title-underline"></div>
          
          <div class="header">
            <div>
              <div class="document-info">
                <div>発行日: ${estimateData.date || ""}</div>
                <div>見積番号: ${estimateData.estimateNumber || ""}</div>
              </div>
              
              <div class="client-info">
                <div class="client-name">${
                  estimateData.clientName || ""
                } 御中</div>
                ${
                  estimateData.clientAddress
                    ? `<div>${estimateData.clientAddress}</div>`
                    : ""
                }
              </div>
            </div>
            
            <div class="company-info">
              <div class="company-name">平田トレーディング株式会社</div>
              <div>〒123-4567 東京都中央区日本橋1-1-1</div>
              <div>TEL: 03-1234-5678 / FAX: 03-1234-5679</div>
              <div>Email: info@hirata-trading.co.jp</div>
              <div class="stamp-area">印</div>
            </div>
          </div>
          
          <div class="total-box">
            <div class="total-label">お見積金額</div>
            <div class="total-value">¥ ${total.toLocaleString()} (税込)</div>
          </div>
          
          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <label>有効期限:</label>
                <span>${estimateData.validUntil || "発行日より30日間"}</span>
              </div>
              <div class="info-item">
                <label>納期:</label>
                <span>${estimateData.leadTime || "2週間"}</span>
              </div>
              <div class="info-item">
                <label>お支払条件:</label>
                <span>${estimateData.paymentMethod || "銀行振込"}</span>
              </div>
              <div class="info-item">
                <label>納品場所:</label>
                <span>${
                  estimateData.deliveryLocation || "お客様指定場所"
                }</span>
              </div>
            </div>
          </div>
          
          <div class="message">
            平素は格別のお引き立てを賜り、誠にありがとうございます。<br>
            下記の通りお見積り申し上げます。ご検討のほど、よろしくお願い申し上げます。
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No.</th>
                <th style="width: 12%;">商品コード</th>
                <th style="width: 28%;">品名・摘要</th>
                <th style="width: 10%;" class="text-center">数量</th>
                <th style="width: 10%;" class="text-center">単位</th>
                <th style="width: 15%;" class="text-right">単価(円)</th>
                <th style="width: 20%;" class="text-right">金額(円)</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((item, index) => {
                  const quantity = parseFloat(item.quantity) || 0;
                  const unitPrice = parseFloat(item.unitPrice) || 0;
                  const amount = quantity * unitPrice;

                  return `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center">${item.productCode || ""}</td>
                  <td>${item.productName || ""}</td>
                  <td class="text-center">${quantity}</td>
                  <td class="text-center">${item.unit || "個"}</td>
                  <td class="text-right">${unitPrice.toLocaleString()}</td>
                  <td class="text-right">${amount.toLocaleString()}</td>
                </tr>
              `;
                })
                .join("")}
              
              ${Array(Math.max(0, 5 - items.length))
                .fill()
                .map(
                  (_, i) => `
                <tr>
                  <td class="text-center">&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #f5f5f5; font-weight: bold;">小計</td>
                <td class="text-right" style="background-color: #f5f5f5; font-weight: bold;">${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #f5f5f5; font-weight: bold;">消費税 (10%)</td>
                <td class="text-right" style="background-color: #f5f5f5; font-weight: bold;">${tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #333; color: white; font-weight: bold;">合計金額</td>
                <td class="text-right" style="background-color: #333; color: white; font-weight: bold;">${total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="notes">
            <div class="notes-title">備考</div>
            <div class="notes-content">${estimateData.notes || ""}</div>
          </div>
          
          <div class="footer">
            <div>本見積書に関するお問い合わせは下記までお願いいたします</div>
            <div>平田トレーディング株式会社 TEL: 03-1234-5678 / Email: info@hirata-trading.co.jp</div>
          </div>
        </div>
      </body>
      </html>
    `;
    console.log("HTML template generated");

    // Set content and wait until all resources are fully loaded with improved timeout
    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
      timeout: 60000, // Extend timeout to 60 seconds
    });
    console.log("Content loaded");

    // Ensure proper rendering with a wait
    await page.waitForTimeout(2000);
    console.log("Additional rendering time completed");

    // Force background colors to be explicitly printed
    await page.emulateMediaType("screen");
    console.log("Media type set to screen");

    // Generate PDF with explicit white background
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      preferCSSPageSize: true,
      timeout: 60000, // Extend timeout to 60 seconds
    });
    console.log("PDF generated successfully");

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    
    // Enhanced error details for debugging
    if (error.code) {
      console.error(`Error code: ${error.code}, syscall: ${error.syscall}`);
    }
    
    // Try a fallback approach using a simpler configuration if available
    try {
      if (page && !browser.isConnected()) {
        console.log("Attempting fallback PDF generation with simplified options...");
        // If we still have a page but lost browser connection, try a simplified approach
        const simplePdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true
        });
        console.log("Fallback PDF generated successfully");
        return simplePdfBuffer;
      }
    } catch (fallbackError) {
      console.error("Fallback PDF generation also failed:", fallbackError);
    }
    
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // Safe cleanup
    if (page) {
      try {
        await page.close();
        console.log("Page closed successfully");
      } catch (closeError) {
        console.error("Error closing page:", closeError);
      }
    }
    
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed successfully");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
};

    // Set content and wait until all resources are fully loaded with improved timeout
    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
      timeout: 60000, // Extend timeout to 60 seconds
    });
    console.log("Content loaded");

    // Ensure proper rendering with a wait
    await page.waitForTimeout(2000);
    console.log("Additional rendering time completed");

    // Force background colors to be explicitly printed
    await page.emulateMediaType("screen");
    console.log("Media type set to screen");

    // Generate PDF with explicit white background
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      preferCSSPageSize: true,
      timeout: 60000, // Extend timeout to 60 seconds
    });
    console.log("PDF generated successfully");

    return pdfBuffer;
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    
    // Enhanced error details for debugging
    if (error.code) {
      console.error(`Error code: ${error.code}, syscall: ${error.syscall}`);
    }
    
    // Try a fallback approach using a simpler configuration if available
    try {
      if (page && !browser.isConnected()) {
        console.log("Attempting fallback PDF generation with simplified options...");
        // If we still have a page but lost browser connection, try a simplified approach
        const simplePdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true
        });
        console.log("Fallback PDF generated successfully");
        return simplePdfBuffer;
      }
    } catch (fallbackError) {
      console.error("Fallback PDF generation also failed:", fallbackError);
    }
    
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    // Safe cleanup
    if (page) {
      try {
        await page.close();
        console.log("Page closed successfully");
      } catch (closeError) {
        console.error("Error closing page:", closeError);
      }
    }
    
    if (browser) {
      try {
        await browser.close();
        console.log("Browser closed successfully");
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
};

/**
 * Generate a PDF for a purchase order using Puppeteer
 * This properly handles Japanese text rendering with improved error handling
 * @param {Object} orderData - The purchase order data
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer for the PDF
 */
exports.generateOrderPDF = async (orderData) => {
  let browser = null;
  let page = null;
  
  try {
    console.log("Starting PDF generation for order...");
    browser = await getBrowserInstance();
    console.log("Browser launched successfully");

    // Create a new page
    page = await browser.newPage();
    console.log("New page created");

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2,
    });
    console.log("Viewport set");

    // Calculate totals
    const items = orderData.items || [];
    const subtotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const taxRate = 0.1; // 10% tax
    const tax = Math.floor(subtotal * taxRate);
    const total = subtotal + tax;
    console.log("Calculations completed");

    // Generate HTML template with proper Japanese fonts
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>発注書</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          
          body {
            font-family: 'Noto Sans JP', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial;
            margin: 0;
            padding: 20px;
            color: #333;
            font-size: 11px;
            background-color: #ffffff;
          }
          
          .document {
            max-width: 210mm;
            margin: 0 auto;
            background-color: #ffffff;
          }
          
          .document-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #000000;
          }
          
          .title-underline {
            width: 50mm;
            height: 1px;
            background-color: #000;
            margin: 0 auto 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          
          .company-info {
            text-align: right;
          }
          
          .company-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .stamp-area {
            border: 1px solid #999;
            width: 25mm;
            height: 25mm;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            margin-left: auto;
            background-color: #ffffff;
          }
          
          .supplier-info {
            border: 1px solid #ccc;
            background-color: #f5f5f5;
            padding: 10px;
            width: 40%;
          }
          
          .supplier-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .document-info {
            margin-bottom: 10px;
          }
          
          .total-box {
            border: 1px solid #000;
            background-color: #f5f5f5;
            padding: 10px;
            margin: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .total-label {
            font-size: 14px;
            font-weight: bold;
          }
          
          .total-value {
            font-size: 16px;
            font-weight: bold;
          }
          
          .info-section {
            background-color: #f5f5f5;
            padding: 10px;
            margin: 15px 0;
            border-left: 3px solid #333;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .info-item label {
            font-weight: bold;
            margin-right: 5px;
          }
          
          .message {
            margin: 15px 0;
            line-height: 1.5;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          th {
            background-color: #333;
            color: white;
            padding: 8px;
            text-align: left;
            font-weight: normal;
          }
          
          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          
          tr:nth-child(even) td {
            background-color: #f5f5f5;
          }
          
          .text-center {
            text-align: center;
          }
          
          .text-right {
            text-align: right;
          }
          
          .notes {
            margin-top: 20px;
          }
          
          .notes-title {
            font-weight: bold;
            border-bottom: 1px solid #333;
            display: inline-block;
            margin-bottom: 5px;
          }
          
          .notes-content {
            white-space: pre-line;
            line-height: 1.5;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background-color: #ffffff !important;
            }
            
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="document-title">発注書</div>
          <div class="title-underline"></div>
          
          <div class="header">
            <div>
              <div class="document-info">
                <div>発行日: ${orderData.date || ""}</div>
                <div>発注番号: ${orderData.orderNumber || ""}</div>
              </div>
              
              <div class="supplier-info">
                <div class="supplier-name">${
                  orderData.supplierName || ""
                } 御中</div>
                ${
                  orderData.supplierAddress
                    ? `<div>${orderData.supplierAddress}</div>`
                    : ""
                }
              </div>
            </div>
            
            <div class="company-info">
              <div class="company-name">平田トレーディング株式会社</div>
              <div>〒123-4567 東京都中央区日本橋1-1-1</div>
              <div>TEL: 03-1234-5678 / FAX: 03-1234-5679</div>
              <div>Email: info@hirata-trading.co.jp</div>
              <div class="stamp-area">印</div>
            </div>
          </div>
          
          <div class="total-box">
            <div class="total-label">発注金額</div>
            <div class="total-value">¥ ${total.toLocaleString()} (税込)</div>
          </div>
          
          <div class="info-section">
            <div class="info-grid">
              <div class="info-item">
                <label>納期:</label>
                <span>${orderData.requestedDeliveryDate || "指定なし"}</span>
              </div>
              <div class="info-item">
                <label>納品先担当者:</label>
                <span>${orderData.deliveryContact || "田中"}</span>
              </div>
              <div class="info-item">
                <label>お支払条件:</label>
                <span>${orderData.paymentMethod || "月末締め翌月末払い"}</span>
              </div>
              <div class="info-item">
                <label>納品先電話:</label>
                <span>${
                  orderData.deliveryPhone || orderData.phone || "03-1234-5678"
                }</span>
              </div>
              <div class="info-item">
                <label>納品場所:</label>
                <span>${orderData.deliveryLocation || "弊社指定倉庫"}</span>
              </div>
              <div class="info-item">
                <label>納品方法:</label>
                <span>${orderData.deliveryMethod || "指定なし"}</span>
              </div>
            </div>
          </div>
          
          <div class="message">
            平素は格別のご高配を賜り、厚く御礼申し上げます。<br>
            下記の通り発注いたしますので、よろしくお願い申し上げます。
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">No.</th>
                <th style="width: 12%;">商品コード</th>
                <th style="width: 28%;">品名・摘要</th>
                <th style="width: 10%;" class="text-center">数量</th>
                <th style="width: 10%;" class="text-center">単位</th>
                <th style="width: 15%;" class="text-right">単価(円)</th>
                <th style="width: 20%;" class="text-right">金額(円)</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map((item, index) => {
                  const quantity = parseFloat(item.quantity) || 0;
                  const unitPrice = parseFloat(item.unitPrice) || 0;
                  const amount = quantity * unitPrice;

                  return `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td class="text-center">${item.productCode || ""}</td>
                  <td>${item.productName || ""}</td>
                  <td class="text-center">${quantity}</td>
                  <td class="text-center">${item.unit || "個"}</td>
                  <td class="text-right">${unitPrice.toLocaleString()}</td>
                  <td class="text-right">${amount.toLocaleString()}</td>
                </tr>
              `;
                })
                .join("")}
              
              ${Array(Math.max(0, 5 - items.length))
                .fill()
                .map(
                  (_, i) => `
                <tr>
                  <td class="text-center">&nbsp;</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #f5f5f5; font-weight: bold;">小計</td>
                <td class="text-right" style="background-color: #f5f5f5; font-weight: bold;">${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #f5f5f5; font-weight: bold;">消費税 (10%)</td>
                <td class="text-right" style="background-color: #f5f5f5; font-weight: bold;">${tax.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="6" class="text-right" style="background-color: #333; color: white; font-weight: bold;">合計金額</td>
                <td class="text-right" style="background-color: #333; color: white; font-weight: bold;">${total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="notes">
            <div class="notes-title">備考</div>
            <div class="notes-content">${orderData.notes || ""}</div>
          </div>
          
          <div class="footer">
            <div>本発注書に関するお問い合わせは下記までお願いいたします</div>
            <div>平田トレーディング株式会社 TEL: 03-1234-5678 / Email: info@hirata-trading.co.jp</div>
          </div>
        </div>
      </body>
      </html>
    `;
    console.log("HTML template generated");