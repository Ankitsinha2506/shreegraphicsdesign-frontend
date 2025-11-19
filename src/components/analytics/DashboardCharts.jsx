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

    // ---------------- DAILY ORDERS ----------------
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

    // ---------------- MONTHLY REVENUE ----------------
    const revenueBarChart = {
        labels: revenueData.map(d => d.month),
        datasets: [
            {
                label: "Revenue (₹)",
                data: revenueData.map(d => d.total),
                backgroundColor: "#F97316",
                borderColor: "#EA580C",
                borderWidth: 2,
                borderRadius: 6
            }
        ]
    };

    // ---------------- NEW USERS ----------------
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ---------------- ROW 1 ---------------- */}

            {/* DAILY ORDERS */}
            <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="font-semibold mb-3 text-gray-900">Daily Orders</h3>
                <Line height={120} data={ordersLineChart} />
            </div>

            {/* MONTHLY REVENUE */}
            <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="font-semibold mb-3 text-gray-900">Monthly Revenue</h3>
                <Bar height={120} data={revenueBarChart} />
            </div>

            {/* ---------------- ROW 2 ---------------- */}

            {/* NEW USERS */}
            <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="font-semibold mb-3 text-gray-900">New Users</h3>
                <Line height={120} data={usersAreaChart} />
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Order Summary</h3>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                    {/* Pie Chart */}
                    <div className="w-48 h-48 mx-auto md:mx-0">
                        <Pie data={pieChart} />
                    </div>

                    {/* Summary Text */}
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <p className="text-3xl font-bold text-indigo-600">
                            {ordersData.reduce((t, x) => t + x.count, 0)}
                        </p>
                        <p className="text-gray-700 text-md font-medium">Total Orders</p>

                        <p className="text-gray-600 text-sm leading-relaxed">
                            Shows overall order volume based on daily logs.
                        </p>

                        <div className="mt-2 px-3 py-2 bg-indigo-100 text-indigo-800 rounded-md text-xs">
                            Updated daily from system records
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
