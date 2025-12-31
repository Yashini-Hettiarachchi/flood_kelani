import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.phoneNumber.trim()) {
      setErrorMessage("Phone number is required");
      return;
    }

    if (!formData.password.trim()) {
      setErrorMessage("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setErrorMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("Failed to connect to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Flood Alert System</title>
      </Head>
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <i className="fas fa-water text-3xl text-blue-600"></i>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Login to access your flood alert dashboard
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 text-xl mr-3"></i>
                <p className="text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-gray-400"></i>
                  </div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                    placeholder="+94 77 123 4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Link 
                href="/dashboard"
                className="w-full block text-center py-3 px-6 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Continue as Guest
              </Link>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Why Login?</h3>
            <ul className="space-y-2">
              <li className="flex items-start text-sm text-gray-600">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span>Access personalized flood alerts</span>
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span>Manage your notification preferences</span>
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span>View historical flood data for your area</span>
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <i className="fas fa-check-circle text-green-500 mt-0.5 mr-2"></i>
                <span>Get early warning notifications</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
