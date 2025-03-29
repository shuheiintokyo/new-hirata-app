import "./globals.css";

export const metadata = {
  title: "平田トレーディング 見積・発注システム",
  description: "見積書と発注書を作成・管理するためのシステム",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
