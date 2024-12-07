import Button from "@/components/Button";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>
        <section className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Beautiful analytics to grow smarter
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg">
                Get started
              </Button>
              <Button variant="secondary" size="lg">
                Learn more
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;