import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function POST(request) {
  let browser = null;
  try {
    const data = await request.json();
    const { type, ...documentData } = data;

    console.log("Starting PDF generation for type:", type);

    // Enhanced browser launch configuration
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--font-render-hinting=none",
        "--disable-gpu",
      ],
      timeout: 30000,
    });

    console.log("Browser launched successfully");

    const page = await browser.newPage();
    console.log("New page created");

    try {
      // Calculate totals
      const items = documentData.items || [];
      const subtotal = items.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return sum + quantity * unitPrice;
      }, 0);

      const taxRate = 0.1; // 10% tax
      const tax = Math.floor(subtotal * taxRate);
      const total = subtotal + tax;

      // Generate HTML template with full styling
      const html = generateHTML(type, documentData, subtotal, tax, total);

      // Set content and generate PDF with timeout and error handling
      console.log("Setting page content");
      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      console.log("Content set successfully");

      console.log("Generating PDF");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "8mm", right: "8mm", bottom: "8mm", left: "8mm" },
        preferCSSPageSize: true,
        timeout: 30000,
      });
      console.log("PDF generated successfully");

      // Validate PDF buffer
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error("Generated PDF is empty");
      }

      // Convert Buffer to Base64 with proper error handling
      let base64Pdf;
      try {
        base64Pdf = pdfBuffer.toString("base64");
        if (!base64Pdf) {
          throw new Error("Failed to convert PDF to base64");
        }
      } catch (error) {
        console.error("Base64 conversion error:", error);
        throw new Error("Failed to process PDF data");
      }
      console.log("PDF converted to base64");

      return NextResponse.json({
        success: true,
        data: base64Pdf,
        contentType: "application/pdf",
      });
    } finally {
      if (page) {
        await page.close();
        console.log("Page closed");
      }
    }
  } catch (error) {
    console.error("PDF generation failed with error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        success: false,
        error: `PDF generation failed: ${error.message}`,
        stack: error.stack,
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

function generateHTML(type, data, subtotal, tax, total) {
  const isEstimate = type === "estimate";
  const documentTitle = isEstimate ? "見積書" : "注文書";
  const documentNumber = isEstimate ? data.estimateNumber : data.orderNumber;
  const totalLabel = isEstimate ? "お見積金額" : "ご注文金額";
  const messageText = isEstimate
    ? "下記の通りお見積り申し上げます。ご検討のほど、よろしくお願い申し上げます。"
    : "下記の通りご注文申し上げます。";
  const footerText = isEstimate ? "本見積書" : "本注文書";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${documentTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
        
        body {
          font-family: 'Noto Sans JP', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial;
          margin: 0;
          padding: 15px;
          color: #333;
          font-size: 10px;
          background-color: #ffffff;
        }
        
        .document {
          max-width: 210mm;
          margin: 0 auto;
          background-color: #ffffff;
        }
        
        .document-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 3px;
          color: #000000;
        }
        
        .title-underline {
          width: 40mm;
          height: 1px;
          background-color: #000;
          margin: 0 auto 15px;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        
        .company-info {
          text-align: right;
          font-size: 9px;
        }
        
        .company-name {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 3px;
        }
        
        .stamp-area {
          border: 1px solid #999;
          width: 20mm;
          height: 20mm;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 5px;
          margin-left: auto;
        }
        
        .client-info {
          border: 1px solid #ccc;
          background-color: #f5f5f5;
          padding: 8px;
          width: 40%;
        }
        
        .client-name {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 3px;
        }
        
        .document-info {
          margin-bottom: 8px;
        }
        
        .total-box {
          border: 1px solid #000;
          background-color: #f5f5f5;
          padding: 8px;
          margin: 10px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .total-label {
          font-size: 12px;
          font-weight: bold;
        }
        
        .total-value {
          font-size: 14px;
          font-weight: bold;
        }
        
        .info-section {
          background-color: #f5f5f5;
          padding: 8px;
          margin: 10px 0;
          border-left: 3px solid #333;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px;
          font-size: 9px;
        }
        
        .info-item label {
          font-weight: bold;
          margin-right: 3px;
        }
        
        .message {
          margin: 10px 0;
          line-height: 1.3;
          font-size: 9px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        
        th {
          background-color: #333;
          color: white;
          padding: 6px;
          text-align: left;
          font-weight: normal;
          font-size: 9px;
        }
        
        td {
          padding: 6px;
          border-bottom: 1px solid #ddd;
          font-size: 9px;
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
          margin-top: 10px;
        }
        
        .notes-title {
          font-weight: bold;
          border-bottom: 1px solid #333;
          display: inline-block;
          margin-bottom: 3px;
          font-size: 9px;
        }
        
        .notes-content {
          white-space: pre-line;
          line-height: 1.3;
          font-size: 9px;
        }
        
        .footer {
          margin-top: 15px;
          text-align: center;
          font-size: 8px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 5px;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          @page {
            size: A4;
            margin: 8mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="document">
        <div class="document-title">${documentTitle}</div>
        <div class="title-underline"></div>
        
        <div class="header">
          <div>
            <div class="document-info">
              <div>発行日: ${data.date || ""}</div>
              <div>${isEstimate ? "見積番号" : "注文番号"}: ${
    documentNumber || ""
  }</div>
            </div>
            
            <div class="client-info">
              <div class="client-name">${data.clientName || ""} 御中</div>
              ${data.clientAddress ? `<div>${data.clientAddress}</div>` : ""}
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
          <div class="total-label">${totalLabel}</div>
          <div class="total-value">¥ ${total.toLocaleString()} (税込)</div>
        </div>
        
        <div class="info-section">
          <div class="info-grid">
            ${
              isEstimate
                ? `
            <div class="info-item">
              <label>有効期限:</label>
              <span>${data.validUntil || "発行日より30日間"}</span>
            </div>
            `
                : ""
            }
            <div class="info-item">
              <label>納期:</label>
              <span>${data.leadTime || "2週間"}</span>
            </div>
            <div class="info-item">
              <label>お支払条件:</label>
              <span>${data.paymentMethod || "銀行振込"}</span>
            </div>
            <div class="info-item">
              <label>納品場所:</label>
              <span>${data.deliveryLocation || "お客様指定場所"}</span>
            </div>
          </div>
        </div>
        
        <div class="message">
          平素は格別のお引き立てを賜り、誠にありがとうございます。<br>
          ${messageText}
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
            ${data.items
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
            
            ${Array(Math.max(0, 8 - data.items.length))
              .fill()
              .map(
                (_, i) => `
                  <tr>
                    <td class="text-center">${data.items.length + i + 1}</td>
                    <td></td>
                    <td></td>
                    <td class="text-center">0</td>
                    <td class="text-center">pcs</td>
                    <td class="text-right">0</td>
                    <td class="text-right">0</td>
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
          <div class="notes-content">${data.notes || ""}</div>
        </div>
        
        <div class="footer">
          <div>${footerText}に関するお問い合わせは下記までお願いいたします</div>
          <div>平田トレーディング株式会社 TEL: 03-1234-5678 / Email: info@hirata-trading.co.jp</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
