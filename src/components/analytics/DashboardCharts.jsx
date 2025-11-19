import React from "react";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

export default function DashboardCharts({ ordersData, revenueData, usersData, loading }) {
    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl shadow animate-pulse text-center">
                Loading analytics...
            </div>
        );
    }

    // ---------------- DAILY ORDERS (LINE) ----------------
    const ordersLineChart = {
        labels: ordersData.map(d => d.date),
        datasets: [
            {
                label: "Daily Orders",
                data: ordersData.map(d => d.count),
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59,130,246,0.25)",
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };

    // ---------------- MONTHLY REVENUE (BAR) ----------------
    const revenueBarChart = {
        labels: revenueData.map(d => d.month),
        datasets: [
            {
                label: "Revenue",
                data: revenueData.map(d => d.total),
                backgroundColor: "#F97316",
                borderColor: "#EA580C",
                borderWidth: 1
            }
        ]
    };

    // ---------------- NEW USERS (AREA) ----------------
    const usersAreaChart = {
        labels: usersData.map(d => d.day),
        datasets: [
            {
                label: "New Users",
                data: usersData.map(d => d.count),
                fill: true,
                borderColor: "#10B981",
                backgroundColor: "rgba(16,185,129,0.3)",
                tension: 0.4
            }
        ]
    };

    // ---------------- PIE CHART ----------------
    const pieChart = {
        labels: ["Total Orders"],
        datasets: [
            {
                data: [ordersData.reduce((t, x) => t + x.count, 0)],
                backgroundColor: ["#6366F1"],
                hoverBackgroundColor: ["#4F46E5"]
            }
        ]
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* DAILY ORDERS */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-3 text-gray-900">Daily Orders</h3>
                <Line height={130} data={ordersLineChart} />
            </div>

            {/* MONTHLY REVENUE */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-3 text-gray-900">Monthly Revenue</h3>
                <Bar height={130} data={revenueBarChart} />
            </div>

            {/* NEW USERS */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-3 text-gray-900">New Users</h3>
                <Line height={130} data={usersAreaChart} />
            </div>

            {/* PIE CHART */}
            {/* ORDER SUMMARY (Premium UI) */}
<div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-xl col-span-1 lg:col-span-3">

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-800 text-center mb-6 tracking-tight">
    📊 Order Summary Overview
  </h3>

  {/* Chart + Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

    {/* Pie Chart */}
    <div className="flex justify-center">
      <div className="w-60 h-60">
        <Pie data={pieChart} />
      </div>
    </div>

    {/* Stats Text */}
    <div className="space-y-4 text-center md:text-left">
      <p className="text-4xl font-bold text-indigo-600">
        {ordersData.reduce((t, x) => t + x.count, 0)}
      </p>
      <p className="text-gray-700 text-lg font-medium">Total Orders Received</p>

      <p className="text-sm text-gray-600 leading-relaxed">
        This chart shows the cumulative number of orders placed across all dates.
        It helps you understand overall customer activity and order traffic at a glance.
      </p>

      <div className="mt-3 p-3 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium">
        Updated in real-time based on daily order logs.
      </div>
    </div>

  </div>
</div>


        </div>
    );
}
