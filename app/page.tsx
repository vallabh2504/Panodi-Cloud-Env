export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Welcome to Recipe Meal Planner</h1>
      <p className="text-gray-600 text-lg mb-8">
        Discover delicious recipes and plan your meals effortlessly
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">🍳 Recipes</h2>
          <p className="text-gray-600 mb-4">Browse and manage your favorite recipes</p>
          <a
            href="/recipes"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Explore Recipes
          </a>
        </div>
        <div className="p-6 border rounded-lg hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">📅 Meal Plans</h2>
          <p className="text-gray-600 mb-4">Plan your weekly meals and organize your diet</p>
          <a
            href="/meal-plans"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Meal Plans
          </a>
        </div>
      </div>
    </div>
  );
}
