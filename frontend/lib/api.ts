import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Document {
  id: number
  document_name: string
  file_type: string
  word_count: number
  upload_date: string
  last_accessed?: string
  content_length?: number
}

export interface DocumentDetail extends Document {
  content: string
  file_size: number
}

export interface ChatMessage {
  role: string
  content: string
  timestamp: string
}

export interface ChatRequest {
  document_id?: number
  document_ids?: number[]
  message: string
}

export interface ChatResponse {
  response: string
}

export interface UploadResponse {
  document_id: number
  document_name: string
  word_count: number
  character_count: number
}

export interface StatsResponse {
  total_documents: number
  total_messages: number
  total_content_size: number
  most_recent_document?: string
  most_recent_date?: string
}

// API Functions
export const apiService = {
  // Health check
  async getHealth() {
    const response = await api.get('/health')
    return response.data
  },

  // Document management
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getDocuments(): Promise<Document[]> {
    const response = await api.get('/documents')
    return response.data
  },

  async getDocument(id: number): Promise<DocumentDetail> {
    const response = await api.get(`/documents/${id}`)
    return response.data
  },

  async deleteDocument(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/documents/${id}`)
    return response.data
  },

  async searchDocuments(searchTerm: string) {
    const response = await api.get(`/documents/search/${encodeURIComponent(searchTerm)}`)
    return response.data
  },

  // Chat functionality
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post('/chat', request)
    return response.data
  },

  async getChatHistory(documentId: number, limit: number = 50): Promise<ChatMessage[]> {
    const response = await api.get(`/documents/${documentId}/history?limit=${limit}`)
    return response.data
  },

  async clearChatHistory(documentId: number): Promise<{ message: string }> {
    const response = await api.delete(`/documents/${documentId}/history`)
    return response.data
  },

  // Statistics
  async getStats(): Promise<StatsResponse> {
    const response = await api.get('/stats')
    return response.data
  },
}

export default api
