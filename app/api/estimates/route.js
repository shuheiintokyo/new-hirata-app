import { NextResponse } from "next/server";

// Mock estimates API
// In a real application, you would connect to a database for CRUD operations

// Get all estimates (mock data)
export async function GET() {
  try {
    // Mock data - in a real app, you would fetch from a database
    const estimates = [
      {
        id: "est1",
        estimateNumber: "EST-20250328-001",
        date: "2025/03/28",
        clientName: "山田商事",
        amount: 125000,
        status: "発行済み",
      },
      {
        id: "est2",
        estimateNumber: "EST-20250325-002",
        date: "2025/03/25",
        clientName: "鈴木物産",
        amount: 78500,
        status: "承認待ち",
      },
    ];

    return NextResponse.json({ success: true, estimates });
  } catch (error) {
    console.error("Error fetching estimates:", error);
    return NextResponse.json(
      {
        success: false,
        error: "見積書の取得中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}

// Create a new estimate
export async function POST(request) {
  try {
    const data = await request.json();

    // In a real app, you would validate the data and save to a database
    // For now, we'll just echo back the data with a generated ID
    const newEstimate = {
      id: `est${Date.now()}`,
      ...data,
    };

    return NextResponse.json({
      success: true,
      estimate: newEstimate,
    });
  } catch (error) {
    console.error("Error creating estimate:", error);
    return NextResponse.json(
      {
        success: false,
        error: "見積書の作成中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
