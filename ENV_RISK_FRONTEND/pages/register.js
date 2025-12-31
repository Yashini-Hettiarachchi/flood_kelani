import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function FloodAlertRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    alertMethods: ["SMS", "WhatsApp"],
    locations: [],
    riskLevels: ["Critical", "High"],
    language: "en"
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locations = [
    { value: "colombo-1", label: "Colombo 1 (Fort)" },
    { value: "colombo-2", label: "Colombo 2 (Slave Island)" },
    { value: "colombo-3", label: "Colombo 3 (Kollupitiya)" },
    { value: "colombo-7", label: "Colombo 7 (Cinnamon Gardens)" },
    { value: "colombo-11", label: "Colombo 11 (Pettah)" },
    { value: "kolonnawa", label: "Kolonnawa" },
    { value: "kaduwela", label: "Kaduwela" },
    { value: "moratuwa", label: "Moratuwa" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.phoneNumber.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }

    if (!formData.address) {
      setErrorMessage("Please select a monitoring station");
      return;
    }

    if (formData.alertMethods.length === 0) {
      setErrorMessage("Please select at least one alert method");
      return;
    }

    if (formData.riskLevels.length === 0) {
      setErrorMessage("Please select at least one risk level");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Successfully registered for flood alerts! Redirecting to dashboard...");
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          address: "",
          alertMethods: ["SMS", "WhatsApp"],
          locations: [],
          riskLevels: ["Critical", "High"],
          language: "en"
        });
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setErrorMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage("Failed to connect to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const selectAllLocations = () => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.length === locations.length 
        ? [] 
        : locations.map(loc => loc.value)
    }));
  };

  return (
    <>
      <Head>
        <title>Flood Alert Registration</title>
      </Head>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <i className="fas fa-water text-3xl text-blue-600"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Flood Alert Registration
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay safe with timely flood risk alerts for Colombo District. 
              Get notified via SMS or WhatsApp when flood risks increase in your area.
            </p>
            <p className="mt-3">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Already registered? Login here
              </Link>
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 text-xl mr-3"></i>
                <p className="text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                          placeholder="+94 77 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Monitoring Station *
                      </label>
                      <select
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      >
                        <option value="">Select a monitoring station</option>
                        <option value="nagalagam-street">Nagalagam Street</option>
                        <option value="hanwella">Hanwella</option>
                        <option value="glencourse">Glencourse</option>
                        <option value="kithulgala">Kithulgala</option>
                        <option value="holombuwa">Holombuwa</option>
                        <option value="deraniyagala">Deraniyagala</option>
                        <option value="norwood">Norwood</option>
                      </select>
                    </div>
                  </div>

                  {/* Alert Methods */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Alert Methods
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { value: "SMS", icon: "fa-sms", color: "blue", label: "SMS", desc: "Instant text messages" },
                        { value: "WhatsApp", icon: "fa-whatsapp", color: "green", label: "WhatsApp", desc: "WhatsApp messages", brand: true },
                        { value: "Email", icon: "fa-envelope", color: "red", label: "Email", desc: "Email notifications" },
                        { value: "Push", icon: "fa-bell", color: "purple", label: "Push", desc: "Mobile app notifications" }
                      ].map(method => (
                        <label
                          key={method.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.alertMethods.includes(method.value)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleArrayValue("alertMethods", method.value)}
                        >
                          <input 
                            type="checkbox" 
                            checked={formData.alertMethods.includes(method.value)}
                            onChange={() => {}}
                            className="hidden" 
                          />
                          <div className="flex items-center space-x-3">
                            <i className={`${method.brand ? 'fab' : 'fas'} ${method.icon} text-2xl text-${method.color}-500`}></i>
                            <div>
                              <div className="font-medium text-gray-900">{method.label}</div>
                              <div className="text-sm text-gray-600">{method.desc}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Risk Levels */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Alert Preferences
                    </h3>
                    
                    <div className="space-y-3">
                      <p className="text-gray-600 text-sm">
                        Choose which risk levels you want to be notified about:
                      </p>
                      
                      {[
                        { value: "Critical", color: "red", bg: "bg-red-500", label: "Critical Risk", desc: "Immediate danger - Evacuation likely required" },
                        { value: "High", color: "orange", bg: "bg-orange-500", label: "High Risk", desc: "High risk - Take precautionary measures" },
                        { value: "Medium", color: "yellow", bg: "bg-yellow-500", label: "Medium Risk", desc: "Moderate risk - Stay alert" },
                        { value: "Low", color: "green", bg: "bg-green-500", label: "Low Risk", desc: "Low risk - Informational only" }
                      ].map(risk => (
                        <label
                          key={risk.value}
                          className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.riskLevels.includes(risk.value)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleArrayValue("riskLevels", risk.value)}
                        >
                          <input 
                            type="checkbox" 
                            checked={formData.riskLevels.includes(risk.value)}
                            onChange={() => {}}
                            className={`rounded border-gray-300 text-${risk.color}-600 focus:ring-${risk.color}-500 mt-1 hidden`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`w-3 h-3 ${risk.bg} rounded-full`}></span>
                              <span className="font-semibold text-gray-900">{risk.label}</span>
                            </div>
                            <p className="text-sm text-gray-600">{risk.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language Preference */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                      Language Preference
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "en", label: "English", desc: "English alerts" },
                        { value: "si", label: "සිංහල", desc: "Sinhala alerts" },
                        { value: "ta", label: "தமிழ்", desc: "Tamil alerts" }
                      ].map(lang => (
                        <label
                          key={lang.value}
                          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.language === lang.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="language"
                            value={lang.value}
                            checked={formData.language === lang.value}
                            onChange={(e) => setFormData({...formData, language: e.target.value})}
                            className="text-blue-600 focus:ring-blue-500 mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{lang.label}</div>
                            <div className="text-sm text-gray-600">{lang.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bell mr-2"></i>
                          Register for Flood Alerts
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-gray-600 text-sm mt-3">
                      By registering, you agree to receive flood risk alerts and emergency notifications
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              {/* Why Register */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
                  Why Register?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-clock text-green-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Early Warnings</h4>
                      <p className="text-sm text-gray-600">Get alerts before flooding occurs</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-map-marker-alt text-blue-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Location-Specific</h4>
                      <p className="text-sm text-gray-600">Alerts tailored to your area</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-mobile-alt text-purple-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Multiple Channels</h4>
                      <p className="text-sm text-gray-600">SMS, WhatsApp, and more</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-life-ring text-orange-500 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-gray-900">Safety Guidance</h4>
                      <p className="text-sm text-gray-600">Actionable safety instructions</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Community Protection
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Active Subscribers</span>
                    <span className="font-bold text-blue-800">2,847</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Areas Covered</span>
                    <span className="font-bold text-blue-800">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Alerts This Month</span>
                    <span className="font-bold text-blue-800">156</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  <i className="fas fa-phone-alt mr-2"></i>
                  Emergency Contacts
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-red-700 font-medium">Police</span>
                    <span className="font-bold text-red-800">119</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-red-700 font-medium">Ambulance</span>
                    <span className="font-bold text-red-800">1990</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="text-red-700 font-medium">Disaster Management</span>
                    <span className="font-bold text-red-800">117</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}