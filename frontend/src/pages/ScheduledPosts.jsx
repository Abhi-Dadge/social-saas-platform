import { useEffect, useState } from "react";
import API from "../services/api";

export default function ScheduledPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts").then(res => {
      const scheduled = res.data.filter(p => p.status === "Scheduled");
      setPosts(scheduled);
    });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">Scheduled Posts</h2>

      {posts.length === 0 ? (
        <p>No scheduled posts</p>
      ) : (
        posts.map(p => (
          <div key={p.id} className="bg-white p-3 mb-2 rounded shadow">
            {p.content}
          </div>
        ))
      )}
    </div>
  );
}