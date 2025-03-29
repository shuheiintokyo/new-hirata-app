import { NextResponse } from "next/server";

// Mock orders API
// In a real application, you would connect to a database for CRUD operations

// Get all orders (mock data)
export async function GET() {
  try {
    // Mock data - in a real app, you would fetch from a database
    const orders = [
      {
        id: "ord1",
        orderNumber: "ORD-20250328-001",
        date: "2025/03/28",
        supplierName: "東京電子部品",
        amount: 230000,
        status: "発注済み",
      },
      {
        id: "ord2",
        orderNumber: "ORD-20250326-002",
        date: "2025/03/26",
        supplierName: "大阪金属工業",
        amount: 156000,
        status: "納品待ち",
      },
    ];

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        error: "発注書の取得中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request) {
  try {
    const data = await request.json();

    // In a real app, you would validate the data and save to a database
    // For now, we'll just echo back the data with a generated ID
    const newOrder = {
      id: `ord${Date.now()}`,
      ...data,
    };

    return NextResponse.json({
      success: true,
      order: newOrder,
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
