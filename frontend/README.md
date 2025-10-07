# Finance Document Q&A Frontend

A modern Next.js frontend for the Finance Document Q&A API. This application allows users to upload financial documents (PDF, DOCX, TXT) and chat with them using AI.

## Features

- **Document Management**: Upload, view, and delete financial documents
- **AI Chat**: Single document and multi-document chat capabilities
- **Search**: Search through documents by name or content
- **Statistics**: View usage statistics and system health
- **Modern UI**: Built with Tailwind CSS and responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## API Integration

The frontend integrates with the following backend endpoints:

- `GET /health` - Health check
- `POST /documents/upload` - Upload documents
- `GET /documents` - List all documents
- `GET /documents/{id}` - Get document details
- `DELETE /documents/{id}` - Delete document
- `POST /chat` - Send chat messages
- `GET /documents/{id}/history` - Get chat history
- `DELETE /documents/{id}/history` - Clear chat history
- `GET /stats` - Get statistics
- `GET /documents/search/{term}` - Search documents

## Project Structure

```
frontend/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatInterface.tsx
│   ├── DocumentList.tsx
│   ├── DocumentUpload.tsx
│   └── StatsCard.tsx
├── lib/
│   └── api.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Features Overview

### Document Upload
- Drag & drop file upload
- Support for PDF, DOCX, and TXT files
- File size validation (10MB limit)
- Real-time upload progress

### Document Management
- Grid view of all documents
- Search functionality
- Multi-select for cross-document analysis
- Document metadata display

### Chat Interface
- Single document chat with conversation history
- Multi-document analysis mode
- Real-time message streaming
- Message timestamps

### Statistics Dashboard
- Document count and storage usage
- Message statistics
- System health indicators
- Recent activity tracking

## Configuration

The API base URL is configured in `lib/api.ts`. Update the `API_BASE_URL` constant to point to your backend server.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
