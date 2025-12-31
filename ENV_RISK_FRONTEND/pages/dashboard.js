import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import DashboardStats from "../components/DashboardStats";
import StationCards from "../components/StationCards";
import AlertBanner from "../components/AlertBanner";
import WeatherWidget from "../components/WeatherWidget";
import FloodAPIComparison from "../components/FloodAPIComparison";

export default function Dashboard() {

  return (
    <>
      <Head>
        <title>Flood Risk Prediction System - Dashboard</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <i className="fas fa-water text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Flood Risk Prediction System</h1>
                  <p className="text-blue-100 text-sm">
                    Real-time monitoring for Colombo District, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex space-x-6">
                <Link href="/dashboard" className="px-3 py-2 rounded-lg bg-blue-700 font-medium">
                  <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                </Link>
                <Link href="/alerts" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-exclamation-triangle mr-2"></i>Alerts
                </Link>
                <Link href="/predictions" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-bell mr-2"></i>Predictions
                </Link>
                <Link href="/safety-new" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-shield-alt mr-2"></i>Safety
                </Link>
                <Link href="/about-new" className="px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                  <i className="fas fa-info-circle mr-2"></i>About
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Alert Banner */}
          <div className="mb-8">
            <AlertBanner />
          </div>

          {/* System Status Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">24/7 Flood Monitoring Active</h2>
                <p className="text-blue-100">Real-time flood risk assessment for Colombo District</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">🟢</div>
                <p className="text-blue-100">System Operational</p>
              </div>
            </div>
          </div>

          {/* Real-time Statistics from Database */}
          <DashboardStats />

          {/* Weather Widget and Flood API Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <WeatherWidget />
            <FloodAPIComparison />
          </div>

          {/* Station Status Cards - Real-time Data */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <i className="fas fa-broadcast-tower text-blue-600 mr-2"></i>
              Monitoring Stations - Live Status
            </h2>
            <StationCards />
          </div>
        </div>
      </div>
    </>
  );
}