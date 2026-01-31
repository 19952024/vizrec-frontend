import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative z-10 flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-[530px] text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
          Page not found
        </p>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-md bg-[#4a6cf7] px-6 py-3 text-base font-medium text-white transition hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
