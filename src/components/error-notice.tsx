import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorNoticeProps {
  message?: string
  onRetry?: () => void
}

export function ErrorNotice({ message, onRetry }: ErrorNoticeProps) {
  return (
    <Alert className="border-red-200 bg-red-50/80 text-red-900">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-sm font-semibold text-red-800">Erro de Conexão</AlertTitle>
      <AlertDescription className="text-xs text-red-700 flex items-center justify-between gap-4">
        <span>
          {message || 'Não foi possível buscar os dados do projeto. Tente novamente mais tarde.'}
        </span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-red-300 text-red-700 hover:bg-red-100 shrink-0"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
