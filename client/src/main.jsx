import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import AuthProvider from './provider/AuthProvider.jsx'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
