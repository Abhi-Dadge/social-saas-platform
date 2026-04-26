export default function Landing({ setPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-cyan-400">⚡ SocialFlow AI</h1>

        <div className="space-x-4">
          <button
            onClick={() => setPage("login")}
            className="text-gray-300 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => setPage("register")}
            className="bg-cyan-400 text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center mt-24 px-4">

        <p className="bg-gray-800 px-4 py-1 rounded-full text-sm text-cyan-400 mb-4">
          ⚡ Smart Automation Platform
        </p>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Control Your Content <br />
          <span className="text-cyan-400">Across Every Platform</span>
        </h1>

        <p className="max-w-xl text-gray-400 mb-6">
          Automate posting, manage multiple accounts, and boost engagement 
          with intelligent scheduling and seamless integrations.
        </p>

        <button
          onClick={() => setPage("register")}
          className="bg-cyan-400 text-black px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
        >
          Start Free 🚀
        </button>
      </div>

      {/* SOFT GLOW EFFECT */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500 opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 opacity-10 blur-3xl"></div>

    </div>
  );
}