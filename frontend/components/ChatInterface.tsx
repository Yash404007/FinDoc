'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, ChatMessage } from '@/lib/api'
import { apiService } from '@/lib/api'
import { Send, Trash2, X, FileText, Users, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  selectedDocument?: Document | null
  selectedDocuments: Document[]
  onClearSelection: () => void
}

export default function ChatInterface({
  selectedDocument,
  selectedDocuments,
  onClearSelection
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isMultiDocument = selectedDocuments.length > 1
  const currentDocument = selectedDocument || selectedDocuments[0]

  useEffect(() => {
    if (currentDocument && !isMultiDocument) {
      loadChatHistory()
    } else {
      setMessages([])
    }
  }, [currentDocument?.id, isMultiDocument])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    if (!currentDocument) return

    try {
      setLoadingHistory(true)
      const history = await apiService.getChatHistory(currentDocument.id)
      setMessages(history)
    } catch (error) {
      console.error('Error loading chat history:', error)
      toast.error('Failed to load chat history')
    } finally {
      setLoadingHistory(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setLoading(true)

    // Add user message to UI immediately
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      const request = isMultiDocument
        ? {
            document_ids: selectedDocuments.map(doc => doc.id),
            message: userMessage
          }
        : {
            document_id: currentDocument?.id,
            message: userMessage
          }

      const response = await apiService.sendChatMessage(request)
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const clearChatHistory = async () => {
    if (!currentDocument || isMultiDocument) return

    try {
      await apiService.clearChatHistory(currentDocument.id)
      setMessages([])
      toast.success('Chat history cleared')
    } catch (error) {
      console.error('Error clearing chat history:', error)
      toast.error('Failed to clear chat history')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!currentDocument) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <FileText className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            No Document Selected
          </h3>
          <p className="text-secondary-600">
            Select a document from the Documents tab to start chatting
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="card-elevated mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMultiDocument ? (
              <>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-2xl">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Multi-Document Analysis
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {selectedDocuments.length} documents selected for cross-analysis
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentDocument.document_name}
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {currentDocument.file_type.toUpperCase()} • {currentDocument.word_count.toLocaleString()} words
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {!isMultiDocument && messages.length > 0 && (
              <button
                onClick={clearChatHistory}
                className="btn-secondary text-sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear History
              </button>
            )}
            <button
              onClick={onClearSelection}
              className="btn-secondary text-sm"
            >
              <X className="h-4 w-4 mr-2" />
              Change Document
            </button>
          </div>
        </div>

        {isMultiDocument && (
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 mb-2">Selected documents:</p>
            <div className="flex flex-wrap gap-2">
              {selectedDocuments.map((doc) => (
                <span
                  key={doc.id}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {doc.document_name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="card-elevated mb-8">
        <div className="h-[500px] overflow-y-auto custom-scrollbar space-y-6 p-6">
          {loadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute"></div>
                <p className="text-gray-600 font-medium">Loading chat history...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start a conversation
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                Ask questions about {isMultiDocument ? 'your selected documents' : 'this document'} and get AI-powered insights
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl px-6 py-4 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-3 font-medium ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="card-elevated">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask a question about ${isMultiDocument ? 'your documents' : 'this document'}...`}
              className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
              rows={3}
              disabled={loading}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              Press Enter to send
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || loading}
            className="btn-primary px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
