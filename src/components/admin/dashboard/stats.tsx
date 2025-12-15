'use client';

import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  CreditCard,
  DollarSign,
  Bell,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    totalAssessments: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    unreadAlerts: number;
    highRiskUsers: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
      trendUp: true,
    },
    {
      name: 'Assessments',
      value: stats.totalAssessments.toLocaleString(),
      icon: FileText,
      color: 'bg-green-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: CreditCard,
      color: 'bg-purple-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      name: 'Monthly Revenue',
      value: `RM ${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      trend: '+15%',
      trendUp: true,
    },
    {
      name: 'Unread Alerts',
      value: stats.unreadAlerts.toLocaleString(),
      icon: Bell,
      color: stats.unreadAlerts > 0 ? 'bg-amber-500' : 'bg-neutral-500',
      highlight: stats.unreadAlerts > 0,
    },
    {
      name: 'High Risk Users',
      value: stats.highRiskUsers.toLocaleString(),
      icon: AlertTriangle,
      color: stats.highRiskUsers > 0 ? 'bg-red-500' : 'bg-neutral-500',
      highlight: stats.highRiskUsers > 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`relative overflow-hidden rounded-xl bg-neutral-800 border ${
            stat.highlight ? 'border-amber-500/50' : 'border-neutral-700'
          } p-4`}
        >
          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} mb-3`}
          >
            <stat.icon className="w-5 h-5 text-white" />
          </div>

          {/* Value */}
          <p className="text-2xl font-bold text-white">{stat.value}</p>

          {/* Label & Trend */}
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-neutral-400">{stat.name}</p>
            {stat.trend && (
              <span
                className={`flex items-center text-xs font-medium ${
                  stat.trendUp ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {stat.trend}
              </span>
            )}
          </div>

          {/* Highlight indicator */}
          {stat.highlight && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
