import CSVVerifier from './components/CSVVerifier';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-5 text-2xl font-semibold">CSV ID Verifier</h1>
          <CSVVerifier />
        </div>
      </div>
    </div>
  );
}
