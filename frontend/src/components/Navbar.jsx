export default function Navbar({ setPage }) {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center shadow">

      {/* Logo */}
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => setPage("dashboard")}>
        🚀 Social SaaS
      </h1>

      {/* Navigation */}
      <div className="flex items-center space-x-5 text-sm md:text-base">

        <button onClick={() => setPage("dashboard")} className="hover:underline">
          Dashboard
        </button>

        <button onClick={() => setPage("create")} className="hover:underline">
          Create Post
        </button>

        <button onClick={() => setPage("platforms")} className="hover:underline">
          Platforms
        </button>

        <button onClick={() => setPage("scheduled")} className="hover:underline">
          Scheduled
        </button>

        <button onClick={() => setPage("logs")} className="hover:underline">
          Logs
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
        >
          Logout
        </button>

      </div>
    </div>
  );
}