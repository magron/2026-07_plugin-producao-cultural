import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProjects } from '@/hooks/use-salic'
import { formatCurrency, calculateProgress, cn } from '@/lib/utils'

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const { data: projects, isLoading } = useProjects(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchParams(query ? { q: query } : {})
  }

  const getStatusBadge = (status: string) => {
    if (status.includes('Aprovado')) return 'bg-green-100 text-green-800 border-green-200'
    if (status.includes('Captação')) return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-slate-100 text-slate-800 border-slate-200'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buscar Projetos</h1>
        <p className="text-slate-500 mt-1">
          Explore a base de dados do Salic com filtros avançados.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, proponente ou PRONAC..."
            className="pl-9"
          />
        </form>
        <div className="flex gap-2">
          <Select defaultValue="todos">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="aprovado">Aprovados</SelectItem>
              <SelectItem value="captacao">Em Captação</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <Button onClick={handleSearch} className="bg-slate-800 text-white hover:bg-slate-700">
            Buscar
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[100px]">PRONAC</TableHead>
                <TableHead className="min-w-[300px]">Projeto</TableHead>
                <TableHead>Proponente</TableHead>
                <TableHead className="text-right">Aprovado</TableHead>
                <TableHead className="w-[200px]">Captação</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-2 w-full mt-2" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Nenhum projeto encontrado para esta busca.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => {
                  const progress = calculateProgress(project.valor_captado, project.valor_aprovado)
                  return (
                    <TableRow
                      key={project.pronac}
                      className="cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => navigate(`/projeto/${project.pronac}`)}
                    >
                      <TableCell className="font-mono text-xs font-medium text-slate-600">
                        {project.pronac}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{project.nome}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {project.segmento} • {project.uf}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 truncate max-w-[200px]">
                        {project.proponente}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-right">
                        {formatCurrency(project.valor_aprovado)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px] font-medium text-slate-500">
                            <span>{formatCurrency(project.valor_captado)}</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs font-medium border',
                            getStatusBadge(project.status),
                          )}
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
