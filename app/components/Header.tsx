import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            RecipeMealPlanner
          </Link>
          <ul className="flex gap-6">
            <li>
              <Link href="/recipes" className="hover:text-blue-200">
                Recipes
              </Link>
            </li>
            <li>
              <Link href="/meal-plans" className="hover:text-blue-200">
                Meal Plans
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
