import { useEffect, useState } from "react";
import API from "../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const res = await API.get("/posts/logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load logs");
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getStatusColor = (status) => {
    if (status === "Posted") return "text-green-600";
    if (status === "Failed") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📜 Logs</h2>
        <button
          onClick={loadLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Post ID</th>
              <th className="p-3">Platform</th>
              <th className="p-3">Status</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No logs available
                </td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.post_id}</td>
                  <td className="p-3">{log.platform}</td>
                  <td className={`p-3 font-semibold ${getStatusColor(log.status)}`}>
                    {log.status}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {log.created_at}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}