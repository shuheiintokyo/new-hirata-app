export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {currentYear} 平田トレーディング株式会社 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
