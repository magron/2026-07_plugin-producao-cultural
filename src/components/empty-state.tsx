import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Nenhum projeto encontrado',
  description = 'Não encontramos projetos que correspondam aos seus critérios de busca. Tente ajustar os filtros ou pesquisar por outro termo.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <SearchX className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md">{description}</p>
    </div>
  )
}
