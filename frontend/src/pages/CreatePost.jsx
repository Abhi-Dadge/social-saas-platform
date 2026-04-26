import { useState } from "react";
import API from "../services/api";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [time, setTime] = useState("");

  const togglePlatform = (p) => {
    setPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const submit = async () => {
    await API.post("/posts", {
      content,
      platforms,
      scheduledAt: time
    });
    alert("Post submitted 🚀");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-4 text-center">
           Create Post
        </h2>

        {/* TEXTAREA */}
        <textarea
          placeholder="Write your post..."
          className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          onChange={(e) => setContent(e.target.value)}
        />

        {/* MEDIA */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Media</label>
          <input type="file" className="w-full border p-2 rounded-lg" />
        </div>

        {/* PLATFORMS */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Platforms</label>

          <div className="flex gap-3">
            {["twitter", "linkedin"].map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`px-4 py-2 rounded-full border transition ${
                  platforms.includes(p)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Schedule</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          🚀 Submit Post
        </button>

      </div>
    </div>
  );
}