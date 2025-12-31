import Head from "next/head";
import Link from "next/link";

export default function AboutNew() {
  return (
    <>
      <Head>
        <title>About - Flood Risk Prediction System</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <i className="fas fa-water text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Flood Risk Prediction System</h1>
                  <p className="text-blue-100 text-sm">Colombo District, Sri Lanka</p>
                </div>
              </div>

              <div className="flex space-x-6">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link href="/alerts" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Alerts
                </Link>
                <Link href="/predictions" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-chart-line mr-2"></i>Predictions
                </Link>
                <Link href="/safety-new" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-shield-alt mr-2"></i>Safety
                </Link>
                <Link href="/about-new" className="px-3 py-2 rounded-lg bg-blue-700 font-medium">
                  <i className="fas fa-info-circle mr-2"></i>About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About the Flood Risk Prediction System</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Comprehensive flood monitoring and early warning for Colombo District
            </p>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">System Overview</h2>
              <p className="text-lg mb-4">
                This system provides real-time flood monitoring and early warning using advanced machine learning techniques.
              </p>
              <p className="text-lg">
                Delivering accurate, location-based predictions to enhance disaster preparedness and response.
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-brain text-purple-500 mr-3 mt-1"></i>
                  <span>Machine learning predictions</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-bell text-orange-500 mr-3 mt-1"></i>
                  <span>Multi-channel alerts</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-green-500 mr-3 mt-1"></i>
                  <span>Area-specific warnings</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-clock text-blue-500 mr-3 mt-1"></i>
                  <span>24/7 monitoring</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-database text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold">Data Collection</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cogs text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold">Analysis</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold">Prediction</h3>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bell text-blue-600 text-2xl"></i>
                </div>
                <h3 className="font-semibold">Alert Delivery</h3>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <i className="fab fa-python text-blue-500 text-3xl mb-3"></i>
                  <h4 className="font-semibold">Python</h4>
                  <p className="text-gray-600 text-sm">ML Engine</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <i className="fab fa-node-js text-green-500 text-3xl mb-3"></i>
                  <h4 className="font-semibold">Node.js</h4>
                  <p className="text-gray-600 text-sm">Backend</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <i className="fab fa-react text-blue-400 text-3xl mb-3"></i>
                  <h4 className="font-semibold">React</h4>
                  <p className="text-gray-600 text-sm">Frontend</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <i className="fas fa-database text-blue-600 text-3xl mb-3"></i>
                  <h4 className="font-semibold">PostgreSQL</h4>
                  <p className="text-gray-600 text-sm">Database</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources & Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Data Sources</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white border rounded-lg">
                  <i className="fas fa-cloud-sun-rain text-blue-500 text-2xl mr-4"></i>
                  <div>
                    <h4 className="font-semibold">Meteorology Dept</h4>
                    <p className="text-gray-600 text-sm">Weather data</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white border rounded-lg">
                  <i className="fas fa-tint text-blue-400 text-2xl mr-4"></i>
                  <div>
                    <h4 className="font-semibold">Irrigation Dept</h4>
                    <p className="text-gray-600 text-sm">River levels</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white border rounded-lg">
                  <i className="fas fa-shield-alt text-green-500 text-2xl mr-4"></i>
                  <div>
                    <h4 className="font-semibold">DMC</h4>
                    <p className="text-gray-600 text-sm">Flood records</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">System Impact</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-blue-700">Stations</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">Kelani</div>
                  <div className="text-sm text-green-700">River Basin</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">7 Days</div>
                  <div className="text-sm text-orange-700">Forecast</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">98.2%</div>
                  <div className="text-sm text-purple-700">Accuracy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-blue-50 rounded-xl p-10">
            <h2 className="text-3xl font-bold text-center mb-6">Contact & Support</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg text-center">
                <i className="fas fa-envelope text-blue-500 text-2xl mb-3"></i>
                <h4 className="font-semibold mb-2">Email</h4>
                <p>support@floodrisk.lk</p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <i className="fas fa-phone text-green-500 text-2xl mb-3"></i>
                <h4 className="font-semibold mb-2">Phone</h4>
                <p>+94 11 123 4567</p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <i className="fas fa-clock text-orange-500 text-2xl mb-3"></i>
                <h4 className="font-semibold mb-2">Support</h4>
                <p>24/7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
