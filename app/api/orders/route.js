// app/api/orders/route.js
import { NextResponse } from "next/server";

// Get all orders
export async function GET() {
  try {
    // In a real application, this would fetch from a database
    // For demo purposes, we'll return mock data
    return NextResponse.json({
      success: true,
      orders: [],
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "発注書データの取得中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request) {
  try {
    const orderData = await request.json();

    // In a real app, you would save this to a database
    // Generate a PDF file, etc.

    // Mock successful response
    const orderNumber = `ORD-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(
      2,
      "0"
    )}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    return NextResponse.json({
      success: true,
      order: {
        id: Date.now().toString(),
        orderNumber,
        ...orderData,
        createdAt: new Date().toISOString(),
      },
      pdfUrl: "#", // In a real app, this would be the URL to the generated PDF
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "発注書の作成中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
