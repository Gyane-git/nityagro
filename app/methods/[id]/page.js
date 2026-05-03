import Banner from "../components/Banner";
import ColdPressedFlour from "../components/ColdPressedFlour";
import SeedToBottle from "../components/SeedToBottle";
import SideBySide from "../components/SideBySide";
import { METHODS } from "../data";

export default async function MethodPage({ params }) {
  const { id } = await params;
  const method = METHODS[id];

  if (!method) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8F6]">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">404</h1>
          <p className="text-gray-600 mb-8">Oops! Method not found.</p>
          <a
            href="/"
            className="px-8 py-3 bg-[#00462C] text-white rounded-full font-semibold hover:bg-[#003622] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-360 mx-auto px-6 md:px-12 py-4">
      {/* Banner Section */}
      <Banner data={method.Banner} />

      {/* ColdPressedFlour Info Section */}
      <ColdPressedFlour data={method.ColdPressedFlour} />

      {/* SeedToBottle Section */}
      <SeedToBottle data={method.SeedToBottle} />

      {/* SideBySide Section */}
      <SideBySide data={method.SideBySide} />
    </main>
  );
}
