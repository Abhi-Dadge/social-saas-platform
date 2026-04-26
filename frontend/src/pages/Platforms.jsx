export default function Platforms() {
  const platforms = [
    { name: "Twitter", status: "Connected" },
    { name: "LinkedIn", status: "Connected" }
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Platform Connections</h2>

      <div className="grid gap-4">
        {platforms.map(p => (
          <div
            key={p.name}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <span className="font-semibold">{p.name}</span>

            <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}