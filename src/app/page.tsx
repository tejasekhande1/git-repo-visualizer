import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import Button from "@/components/ui/Button";
import ExampleCard from "@/components/features/ExampleCard";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Welcome to {siteConfig.name}
            </h1>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
              {siteConfig.description}
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg" variant="default">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ExampleCard
              title="Well Organized"
              description="Industry-standard folder structure with clear separation of concerns"
              link="#"
            />
            <ExampleCard
              title="Type Safe"
              description="Full TypeScript support with centralized type definitions"
              link="#"
            />
            <ExampleCard
              title="Developer Friendly"
              description="Path aliases and barrel exports for clean, readable imports"
              link="#"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
