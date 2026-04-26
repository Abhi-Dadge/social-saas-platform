import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    const res = await API.get("/posts");
    setPosts(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 🔢 Stats
  const stats = useMemo(() => {
    const total = posts.length;
    const posted = posts.filter(p => p.status === "Posted").length;
    const scheduled = posts.filter(p => p.status === "Scheduled").length;
    const failed = posts.filter(p => p.status === "Failed").length;
    return { total, posted, scheduled, failed };
  }, [posts]);

  const statusBadge = (status) => {
    if (status === "Posted") return "bg-green-100 text-green-700";
    if (status === "Scheduled") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const retry = async (id) => {
    await API.post(`/posts/retry/${id}`);
    alert("Retry triggered 🔁");
    loadPosts();
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    await API.delete(`/posts/${id}`);
    loadPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📊 Dashboard</h2>
        <button
          onClick={loadPosts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Posted" value={stats.posted} color="green" />
        <StatCard title="Scheduled" value={stats.scheduled} color="yellow" />
        <StatCard title="Failed" value={stats.failed} color="red" />
      </div>

      {/* LOADING */}
      {loading && <p className="text-center">Loading...</p>}

      {/* POSTS */}
      <div className="space-y-4">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800">
                {post.content}
              </p>

              <span className={`px-3 py-1 rounded-full text-sm ${statusBadge(post.status)}`}>
                {post.status}
              </span>
            </div>

            {/* PLATFORMS */}
            <div className="mt-3 flex flex-wrap gap-2">
              {post.platforms?.map((p, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {p.platform} ({p.status})
                </span>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-3">
              
              <button
                onClick={() => retry(post.id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Retry
              </button>

              <button
                onClick={() => deletePost(post.id)}
                className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-black"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// 🔹 Stat Card
function StatCard({ title, value, color = "blue" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl shadow ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}