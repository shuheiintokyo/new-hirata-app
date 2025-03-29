"use client";

import { useState, useEffect } from "react";

export default function PDFViewer({ pdfUrl, onClose }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pdfUrl) {
      setLoading(false);
    }
  }, [pdfUrl]);

  if (!pdfUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl w-full h-5/6 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">PDF プレビュー</h2>
          <div>
            <a
              href={pdfUrl}
              download="document.pdf"
              className="inline-flex items-center px-3 py-1 mr-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              ダウンロード
            </a>

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
            />
          )}
        </div>
      </div>
    </div>
  );
}
