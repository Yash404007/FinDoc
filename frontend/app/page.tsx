'use client'

import { useState, useEffect } from 'react'
import { Document, StatsResponse } from '@/lib/api'
import { apiService } from '@/lib/api'
import DocumentUpload from '@/components/DocumentUpload'
import DocumentList from '@/components/DocumentList'
import ChatInterface from '@/components/ChatInterface'
import StatsCard from '@/components/StatsCard'
import { FileText, MessageSquare, Upload, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'documents' | 'chat' | 'upload' | 'stats'>('documents')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [documentsData, statsData] = await Promise.all([
        apiService.getDocuments(),
        apiService.getStats()
      ])
      setDocuments(documentsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDocumentUpload = async (file: File) => {
    try {
      const response = await apiService.uploadDocument(file)
      toast.success(`Document "${response.document_name}" uploaded successfully`)
      await loadData() // Refresh the document list
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload document')
    }
  }

  const handleDocumentDelete = async (id: number) => {
    try {
      await apiService.deleteDocument(id)
      toast.success('Document deleted successfully')
      await loadData() // Refresh the document list
      
      // Clear selection if deleted document was selected
      if (selectedDocument?.id === id) {
        setSelectedDocument(null)
      }
      setSelectedDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete document')
    }
  }

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
    setSelectedDocuments([document])
    setActiveTab('chat')
  }

  const handleMultiDocumentSelect = (documents: Document[]) => {
    console.log('Multi-document select called with:', documents.length, 'documents')
    setSelectedDocuments(documents)
    setSelectedDocument(null)
    // Don't automatically switch to chat tab - let user decide when to start chat
  }

  const handleStartMultiChat = () => {
    setActiveTab('chat')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Awaitt Finance Bot
                </h1>
                <p className="text-sm text-gray-600 font-medium">AI-Powered Accounting and Finance Firm Bot</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats?.total_documents || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Documents</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats?.total_messages || 0}</div>
                <div className="text-sm text-gray-600 font-medium">Messages</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {[
              { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'chat', label: 'Chat', icon: MessageSquare, count: selectedDocuments.length },
              { id: 'stats', label: 'Analytics', icon: BarChart3 },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`group flex items-center space-x-3 py-4 px-6 rounded-t-2xl font-semibold text-sm transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-white shadow-lg text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-200 ${
                  activeTab === id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span>{label}</span>
                {count !== undefined && count > 0 && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === id 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'documents' && (
          <DocumentList
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            onDocumentDelete={handleDocumentDelete}
            onMultiSelect={handleMultiDocumentSelect}
            selectedDocuments={selectedDocuments}
            onStartMultiChat={handleStartMultiChat}
          />
        )}

        {activeTab === 'upload' && (
          <DocumentUpload onUpload={handleDocumentUpload} />
        )}

        {activeTab === 'chat' && (
          <ChatInterface
            selectedDocument={selectedDocument}
            selectedDocuments={selectedDocuments}
            onClearSelection={() => {
              setSelectedDocument(null)
              setSelectedDocuments([])
            }}
          />
        )}

        {activeTab === 'stats' && stats && (
          <StatsCard stats={stats} />
        )}
      </main>
    </div>
  )
}
