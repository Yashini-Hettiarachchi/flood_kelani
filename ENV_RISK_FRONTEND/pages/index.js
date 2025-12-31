import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Flood Risk Prediction & Alert System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Monitor flood risks in real-time and receive alerts
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              View Dashboard
            </Link>
            <Link href="/register" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
              Register
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Real-time Monitoring</h3>
            <p className="text-gray-600">Track water levels and weather conditions continuously</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Risk Prediction</h3>
            <p className="text-gray-600">AI-powered flood risk assessment for your area</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-900 font-semibold mb-2">Alert System</h3>
            <p className="text-gray-600">Get notified immediately when flood risk increases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
