export default function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-medium text-gray-700">
          Loading product details...
        </p>
      </div>
    </div>
  );
}
