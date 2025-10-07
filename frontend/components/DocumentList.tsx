'use client'

import { useState, useEffect } from 'react'
import { Document } from '@/lib/api'
import { FileText, Trash2, MessageSquare, Search, Calendar, FileType, Hash, X, Upload } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

interface DocumentListProps {
  documents: Document[]
  onDocumentSelect: (document: Document) => void
  onDocumentDelete: (id: number) => void
  onMultiSelect: (documents: Document[]) => void
  selectedDocuments: Document[]
  onStartMultiChat?: () => void
}

export default function DocumentList({
  documents,
  onDocumentSelect,
  onDocumentDelete,
  onMultiSelect,
  selectedDocuments,
  onStartMultiChat
}: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [multiSelectMode, setMultiSelectMode] = useState(false)

  // Debug multi-select mode changes
  useEffect(() => {
    console.log('Multi-select mode changed:', multiSelectMode)
  }, [multiSelectMode])

  // Debug selected documents changes
  useEffect(() => {
    console.log('Selected documents changed:', selectedDocuments.length, selectedDocuments.map(d => d.id))
  }, [selectedDocuments])

  const filteredDocuments = documents.filter(doc =>
    doc.document_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMultiSelectToggle = (document: Document) => {
    console.log('Multi-select toggle:', { 
      multiSelectMode, 
      documentId: document.id, 
      selectedCount: selectedDocuments.length 
    })
    
    if (multiSelectMode) {
      const isSelected = selectedDocuments.some(doc => doc.id === document.id)
      if (isSelected) {
        // Remove from selection
        const newSelection = selectedDocuments.filter(doc => doc.id !== document.id)
        console.log('Removing from selection:', newSelection.length)
        onMultiSelect(newSelection)
      } else {
        // Add to selection
        const newSelection = [...selectedDocuments, document]
        console.log('Adding to selection:', newSelection.length)
        onMultiSelect(newSelection)
      }
    } else {
      // Single select mode - go directly to chat
      onDocumentSelect(document)
    }
  }

  const handleStartMultiSelect = () => {
    console.log('Starting multi-select mode')
    setMultiSelectMode(true)
    onMultiSelect([])
  }

  const handleCancelMultiSelect = () => {
    setMultiSelectMode(false)
    onMultiSelect([])
  }

  const handleStartChat = () => {
    if (selectedDocuments.length > 0) {
      // This will trigger the parent to switch to chat mode with selected documents
      onMultiSelect(selectedDocuments)
      setMultiSelectMode(false)
      // Navigate to chat tab
      if (onStartMultiChat) {
        onStartMultiChat()
      }
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    const iconClass = "h-5 w-5"
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-600`} />
      case 'docx':
        return <FileText className={`${iconClass} text-blue-600`} />
      case 'txt':
        return <FileText className={`${iconClass} text-green-600`} />
      default:
        return <FileText className={`${iconClass} text-secondary-600`} />
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'badge-danger'
      case 'docx':
        return 'badge-primary'
      case 'txt':
        return 'badge-success'
      default:
        return 'badge-gray'
    }
  }

  const getFileTypeBgColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100'
      case 'docx':
        return 'bg-blue-100'
      case 'txt':
        return 'bg-green-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Document Library
            </h2>
            {multiSelectMode && (
              <span className="badge badge-primary">
                Multi-select Mode
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="status-online"></div>
              <span className="font-medium">{documents.length} documents</span>
            </div>
            {multiSelectMode && selectedDocuments.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-700">{selectedDocuments.length} selected</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!multiSelectMode ? (
            <button
              onClick={handleStartMultiSelect}
              className="btn-secondary"
            >
              Select Multiple
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-secondary-600">
                {selectedDocuments.length} selected
              </span>
              <button
                onClick={handleStartChat}
                disabled={selectedDocuments.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chat ({selectedDocuments.length})
              </button>
              <button
                onClick={handleCancelMultiSelect}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search documents by name or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12 pr-4"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {searchTerm ? 'No documents found' : 'No documents uploaded'}
          </h3>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms or browse all documents'
              : 'Upload your first document to start analyzing with AI'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => {/* Switch to upload tab */}}
              className="btn-primary mt-6"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => {
            const isSelected = selectedDocuments.some(doc => doc.id === document.id)
            
            return (
              <div
                key={document.id}
                className={`card-interactive group ${
                  multiSelectMode 
                    ? 'border-2 border-dashed border-blue-300 hover:border-blue-500' 
                    : ''
                } ${
                  isSelected 
                    ? 'ring-4 ring-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl' 
                    : ''
                }`}
                onClick={() => handleMultiSelectToggle(document)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl shadow-sm ${getFileTypeBgColor(document.file_type)}`}>
                      {getFileTypeIcon(document.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-lg mb-2">
                        {document.document_name}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`badge ${getFileTypeColor(document.file_type)}`}>
                          {document.file_type.toUpperCase()}
                        </span>
                        {multiSelectMode && (
                          <span className="text-sm text-blue-600 font-medium">
                            Click to {isSelected ? 'deselect' : 'select'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {multiSelectMode && (
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 shadow-lg' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 bg-white rounded-sm"></div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{document.word_count.toLocaleString()} words</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {format(new Date(document.upload_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {!multiSelectMode && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDocumentSelect(document)
                      }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Are you sure you want to delete this document?')) {
                          onDocumentDelete(document.id)
                        }
                      }}
                      className="btn-ghost text-sm px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
