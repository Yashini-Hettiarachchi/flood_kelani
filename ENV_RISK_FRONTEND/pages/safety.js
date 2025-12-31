import Head from "next/head";
import Link from "next/link";

export default function Safety() {
  return (
    <>
      <Head>
        <title>Safety Guidelines - Flood Risk Prediction</title>
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
                <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-blue-500">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link href="/alerts" className="px-3 py-2 rounded-lg hover:bg-blue-500">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Alerts
                </Link>
                <Link href="/predictions" className="px-3 py-2 rounded-lg hover:bg-blue-500">
                  <i className="fas fa-chart-line mr-2"></i>Predictions
                </Link>
                <Link href="/safety" className="px-3 py-2 rounded-lg bg-blue-700 font-medium">
                  <i className="fas fa-shield-alt mr-2"></i>Safety
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-blue-500">
                  <i className="fas fa-info-circle mr-2"></i>About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800">Emergency Preparedness</h2>
                <p className="text-red-700 mt-1">Stay safe during flood situations</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-3xl font-bold mb-6">Flood Safety Guidelines</h2>
                
                {/* Risk Levels */}
                <div className="space-y-6 mb-8">
                  {/* Medium Risk */}
                  <div className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-6">
                    <h3 className="text-orange-600 font-bold text-lg mb-3">Medium Risk - Stay Alert</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-orange-500 mt-1 mr-3"></i>
                        <span>Monitor weather updates regularly</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-orange-500 mt-1 mr-3"></i>
                        <span>Prepare emergency kit with essentials</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-orange-500 mt-1 mr-3"></i>
                        <span>Review evacuation plans</span>
                      </li>
                    </ul>
                  </div>

                  {/* High Risk */}
                  <div className="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
                    <h3 className="text-red-600 font-bold text-lg mb-3">High Risk - Take Action</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-red-500 mt-1 mr-3"></i>
                        <span>Move to higher ground immediately</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-red-500 mt-1 mr-3"></i>
                        <span>Secure loose outdoor items</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check-circle text-red-500 mt-1 mr-3"></i>
                        <span>Charge all electronic devices</span>
                      </li>
                    </ul>
                  </div>

                  {/* Critical Risk */}
                  <div className="border-l-4 border-red-800 bg-red-100 rounded-lg p-6">
                    <h3 className="text-red-800 font-bold text-lg mb-3">Critical Risk - Evacuate Now</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fas fa-exclamation-circle text-red-800 mt-1 mr-3"></i>
                        <span>Evacuate immediately if ordered</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-exclamation-circle text-red-800 mt-1 mr-3"></i>
                        <span>Do not drive through flood water</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-exclamation-circle text-red-800 mt-1 mr-3"></i>
                        <span>Contact emergency services if trapped</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Emergency Kit */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">
                    <i className="fas fa-backpack mr-3"></i>
                    Emergency Kit Essentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Basic Supplies</h4>
                      <ul className="space-y-1 text-sm">
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Water (3+ days)</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Non-perishable food</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>First aid kit</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Flashlight & batteries</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Important Items</h4>
                      <ul className="space-y-1 text-sm">
                        <li><i className="fas fa-check text-green-500 mr-2"></i>ID documents</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Insurance papers</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Medical records</li>
                        <li><i className="fas fa-check text-green-500 mr-2"></i>Cash & cards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Emergency Contacts */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">
                  <i className="fas fa-phone-alt text-red-500 mr-2"></i>
                  Emergency Contacts
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="font-bold text-red-800">Emergency</div>
                    <div className="text-2xl font-bold text-red-600">117 / 118</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold text-blue-800">Disaster Mgmt</div>
                    <div className="text-lg text-blue-600">+94 11 267 1096</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold text-green-800">Flood Support</div>
                    <div className="text-lg text-green-600">+94 11 243 6136</div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                  Safety Tips
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• 6 inches of water can knock you down</li>
                  <li>• 12 inches can carry away vehicles</li>
                  <li>• Never touch electrical equipment when wet</li>
                  <li>• Stay away from downed power lines</li>
                  <li>• Follow evacuation orders immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
