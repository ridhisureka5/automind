export default function AlertsList({ alerts }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Diagnostic Alerts</h3>
      {alerts.map((alert, index) => (
        <div
          key={index}
          className="bg-red-100 border-l-4 border-red-500 p-4 mb-2"
        >
          🚨 {alert}
        </div>
      ))}
    </div>
  );
}
