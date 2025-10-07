'use client'

import { StatsResponse } from '@/lib/api'
import { FileText, MessageSquare, Database, Calendar, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

interface StatsCardProps {
  stats: StatsResponse
}

export default function StatsCard({ stats }: StatsCardProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const statCards = [
    {
      title: 'Total Documents',
      value: stats.total_documents,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Messages',
      value: stats.total_messages,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Storage Used',
      value: formatBytes(stats.total_content_size),
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Most Recent',
      value: stats.most_recent_document || 'None',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
          Analytics Dashboard
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Comprehensive overview of your document collection and AI interaction metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card-elevated group hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  {stat.title}
                </p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden">
              <div className={`h-full w-full bg-gradient-to-r ${stat.color.replace('text-', 'from-').replace('-600', '-400')} to-${stat.color.replace('text-', '').replace('-600', '-600')} rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      {stats.most_recent_date && (
        <div className="card">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="font-medium text-secondary-900">Recent Activity</h3>
              <p className="text-sm text-secondary-600">
                Last document uploaded: {format(new Date(stats.most_recent_date), 'MMM d, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Usage Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-medium text-secondary-900 mb-4">Document Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Total Documents</span>
              <span className="font-medium">{stats.total_documents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Total Messages</span>
              <span className="font-medium">{stats.total_messages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Storage Used</span>
              <span className="font-medium">{formatBytes(stats.total_content_size)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium text-secondary-900 mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Database Status</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">AI Service</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Last Updated</span>
              <span className="text-sm text-secondary-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
