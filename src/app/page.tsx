import CSVVerifier from './components/CSVVerifier';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-6 sm:py-12">
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="to-light-blue-500 absolute inset-0 -skew-y-6 transform bg-gradient-to-r from-cyan-400 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl"></div>
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            CSV ID Verifier
          </h1>
          <CSVVerifier />
        </div>
      </div>
    </div>
  );
}
