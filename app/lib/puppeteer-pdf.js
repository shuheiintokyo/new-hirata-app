// app/lib/puppeteer-pdf.js
// Improved version with better error handling and browser management

const puppeteer = require("puppeteer");

/**
 * Get a browser instance with properly configured launch options
 * @returns {Promise<Browser>} - Puppeteer browser instance
 */
async function getBrowserInstance() {
  try {
    return await puppeteer.launch({
      headless: "new", // Use the new headless mode
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--window-size=1920,1080",
        "--remote-debugging-port=9222",
      ],
      ignoreHTTPSErrors: true,
      timeout: 60000, // Increase timeout to 60 seconds
      executablePath: process.env.CHROME_BIN || null,
      product: "chrome",
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false,
      pipe: true,
    });
  } catch (error) {
    console.error("Failed to launch browser:", error);
    // Add more detailed error logging
    if (error.code === "ECONNRESET") {
      console.error(
        "Connection reset error - possible network or permission issue"
      );
    }
    if (error.code === "EACCES") {
      console.error(
        "Permission denied - check Chrome installation and permissions"
      );
    }
    throw new Error(`Browser launch failed: ${error.message}`);
  }
}

/**
 * Generate a simple PDF from data
 * @param {Object} data - The data to generate PDF from
 * @returns {Promise<Buffer>} - The PDF buffer
 */
exports.generatePDF = async () => {
  let browser = null;
  let page = null;

  try {
    // Use Puppeteer's built-in Chrome
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    page = await browser.newPage();
    await page.setContent("<h1>Hello</h1>");
    return await page.pdf();
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
};

// Convenience functions for specific document types
exports.generateEstimatePDF = async (estimateData) => {
  let browser = null;
  let page = null;

  try {
    // Use the simple browser launch that worked
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    page = await browser.newPage();

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

    // Generate HTML template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>見積書</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');
          body {
            font-family: 'Noto Sans JP', sans-serif;
            margin: 20px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .total {
            text-align: right;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>見積書</h1>
          <p>発行日: ${estimateData.date || new Date().toLocaleDateString()}</p>
        </div>

        <div>
          <p>お客様: ${estimateData.clientName || ""}</p>
        </div>

        <table>
          <tr>
            <th>No.</th>
            <th>商品コード</th>
            <th>品名</th>
            <th>数量</th>
            <th>単価</th>
            <th>金額</th>
          </tr>
          ${items
            .map(
              (item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.productCode || ""}</td>
              <td>${item.productName || ""}</td>
              <td>${item.quantity || 0}</td>
              <td>${(item.unitPrice || 0).toLocaleString()}</td>
              <td>${(
                (item.quantity || 0) * (item.unitPrice || 0)
              ).toLocaleString()}</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <div class="total">
          <p>小計: ¥${subtotal.toLocaleString()}</p>
          <p>消費税 (10%): ¥${tax.toLocaleString()}</p>
          <p>合計金額: ¥${total.toLocaleString()}</p>
        </div>

        ${
          estimateData.notes
            ? `
          <div>
            <h3>備考</h3>
            <p>${estimateData.notes}</p>
          </div>
        `
            : ""
        }
      </body>
      </html>
    `;

    // Set content and generate PDF
    await page.setContent(html);
    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
};

exports.generateOrderPDF = (data) => exports.generatePDF(data, "order");
