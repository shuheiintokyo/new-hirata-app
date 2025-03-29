"use client";

import { useState, useEffect } from "react";

export default function PDFViewer({ pdfUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pdfUrl) {
      setLoading(false);
    }
  }, [pdfUrl]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">エラー</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 self-end"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return null;
  }

  const handleDownload = () => {
    try {
      // Create a temporary link
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
      setError("PDFのダウンロード中にエラーが発生しました。");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl w-full h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">PDF プレビュー</h2>
          <div>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1 mr-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ダウンロード
            </button>

            <button
              onClick={() => window.open(pdfUrl, "_blank")}
              className="inline-flex items-center px-3 py-1 mr-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              新しいタブで開く
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              閉じる
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="sr-only">読み込み中...</span>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="PDF Viewer"
              onError={() => setError("PDFの表示中にエラーが発生しました。")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
