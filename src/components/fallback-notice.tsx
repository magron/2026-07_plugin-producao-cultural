import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FallbackNoticeProps {
  message?: string
}

export function FallbackNotice({ message }: FallbackNoticeProps) {
  return (
    <Alert className="border-amber-200 bg-amber-50/80 text-amber-900">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-sm font-semibold text-amber-800">Modo Demonstração</AlertTitle>
      <AlertDescription className="text-xs text-amber-700">
        {message || 'Não foi possível conectar à API do SALIC. Exibindo dados de demonstração.'}
      </AlertDescription>
    </Alert>
  )
}
