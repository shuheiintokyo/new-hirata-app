// app/api/puppeteer-pdf/route.js
import { NextResponse } from "next/server";
import { generateEstimatePDF, generateOrderPDF } from "@/app/lib/puppeteer-pdf";

export async function POST(request) {
  try {
    // Parse the incoming request body
    const data = await request.json();
    const { type, content } = data; // 'type' can be 'estimate' or 'order'

    // Validate input data
    if (!type || !content) {
      return NextResponse.json(
        { error: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    let pdfBuffer;

    // Generate the appropriate PDF based on the type with error handling
    try {
      if (type === "estimate") {
        pdfBuffer = await generateEstimatePDF(content);
      } else if (type === "order") {
        pdfBuffer = await generateOrderPDF(content);
      } else {
        return NextResponse.json(
          { error: 'Invalid document type. Must be "estimate" or "order".' },
          { status: 400 }
        );
      }
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      return NextResponse.json(
        { error: `Failed to generate PDF: ${pdfError.message}` },
        { status: 500 }
      );
    }

    // Return the PDF with appropriate headers
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${type}-${Date.now()}.pdf"`,
        // Add Cache-Control header to prevent caching issues
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to process PDF generation request",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
