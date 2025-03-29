// app/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-white py-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} 平田トレーディング. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
