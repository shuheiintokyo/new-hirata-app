import { NextResponse } from "next/server";

// Mock authentication API
// In a real application, you would connect to a database and handle proper authentication
export async function POST(request) {
  try {
    const data = await request.json();
    const { username, password } = data;

    // This is a very basic mock authentication
    // In a real app, you would validate against a database and use proper password hashing
    if (username && password) {
      // For demo purposes, accept any non-empty username/password
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          username: username,
          name: "ユーザー",
          role: "admin",
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "ユーザー名またはパスワードが無効です。",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "認証中にエラーが発生しました。",
      },
      { status: 500 }
    );
  }
}
