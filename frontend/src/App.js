import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Platforms from "./pages/Platforms";
import ScheduledPosts from "./pages/ScheduledPosts";
import Logs from "./pages/Logs";

function App() {
  const [page, setPage] = useState("landing");
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
      setPage("create");
    }
  }, []);

  // 🔐 Not logged in
  if (!isAuth) {
    if (page === "login") return <Login setPage={setPage} setAuth={setAuth} />;
    if (page === "register") return <Register setPage={setPage} />;
    return <Landing setPage={setPage} />;
  }

  // ✅ After login
  return (
    <div>
      <Navbar setPage={setPage} />

      {page === "dashboard" && <Dashboard />}
      {page === "create" && <CreatePost />}
      {page === "platforms" && <Platforms />}
      {page === "scheduled" && <ScheduledPosts />}
      {page === "logs" && <Logs />}
    </div>
  );
}

export default App;