export const TestTailwind = () => {
  return (
    <div className="p-8 bg-blue-500 text-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-4">Tailwind CSS Test</h1>
      <p className="text-lg">If you see this styled, Tailwind is working!</p>
      <button className="mt-4 px-6 py-2 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors">
        Click Me
      </button>
    </div>
  );
};