'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>
}

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, DOCX, or TXT file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    try {
      setUploading(true)
      await onUpload(file)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-elevated">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Upload Document
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload PDF, DOCX, or TXT files to start chatting with your financial documents using AI
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={uploading} />
          
          <div className="flex flex-col items-center space-y-6">
            {uploading ? (
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
            ) : (
              <div className={`p-6 rounded-3xl transition-all duration-300 ${
                isDragActive 
                  ? 'bg-blue-100 scale-110' 
                  : 'bg-gray-100 group-hover:bg-blue-100'
              }`}>
                <Upload className={`h-16 w-16 transition-colors duration-300 ${
                  isDragActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-900">
                {uploading ? 'Uploading...' : isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
              </p>
              <p className="text-gray-600">
                or <span className="text-blue-600 font-semibold">click to select a file</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported formats:</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { type: 'PDF', icon: FileText, color: 'text-red-600', bgColor: 'bg-red-100' },
              { type: 'DOCX', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
              { type: 'TXT', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
            ].map(({ type, icon: Icon, color, bgColor }) => (
              <div key={type} className={`flex items-center space-x-3 px-4 py-3 ${bgColor} rounded-xl`}>
                <Icon className={`h-6 w-6 ${color}`} />
                <span className="font-semibold text-gray-800">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-amber-100 rounded-xl">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-amber-800">
              <p className="font-semibold text-lg mb-2">Important Notes</p>
              <ul className="space-y-1 text-sm">
                <li>• File size limit: <span className="font-semibold">10MB</span></li>
                <li>• Make sure your document contains readable text for best results</li>
                <li>• Scanned PDFs may not work well - use text-based PDFs when possible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
