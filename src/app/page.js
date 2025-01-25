import { Suspense } from "react";
import SearchAndFilters from "./components/SearchAndFilters";
import ContentGrid from "./components/ContentGrid";

export default function Home({ searchParams }) {
  return (
    <div className="min-h-screen neon-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <SearchAndFilters />

          <Suspense
            fallback={
              <div className="text-white text-center py-12">Loading...</div>
            }
          >
            <ContentGrid searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
