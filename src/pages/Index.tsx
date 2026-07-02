import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, CheckCircle, Wallet, Activity } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useProjects } from '@/hooks/use-salic'
import { formatCurrency, calculateProgress, cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { FallbackNotice } from '@/components/fallback-notice'

export default function Index() {
  const navigate = useNavigate()
  const { data: recentProjects, isLoading, isFallback } = useProjects()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q')
    if (q) navigate(`/busca?q=${encodeURIComponent(q.toString())}`)
  }

  const chartData = [
    { segmento: 'Música', valor: 12500000 },
    { segmento: 'Teatro', valor: 8500000 },
    { segmento: 'Literatura', valor: 4200000 },
    { segmento: 'Artes Visuais', valor: 6400000 },
    { segmento: 'Patrimônio', valor: 15300000 },
  ]

  const chartConfig = {
    valor: { label: 'Valor Captado (R$)', color: 'hsl(var(--chart-1))' },
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Painel de Controle</h1>
          <p className="text-slate-500 mt-1">Visão executiva dos projetos culturais via Salic.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            name="q"
            placeholder="Buscar PRONAC ou Projeto..."
            className="pl-9 bg-white shadow-sm"
          />
        </form>
      </div>

      {isFallback && <FallbackNotice />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Projetos</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.234</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +12% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Em Captação</CardTitle>
            <Wallet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">R$ 450M</div>
            <p className="text-xs text-amber-700 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +5% este mês
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Valor Aprovado (Ano)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.2B</div>
            <p className="text-xs text-slate-500 mt-1">Acumulado de 2026</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">PRONACs Ativos</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.412</div>
            <p className="text-xs text-slate-500 mt-1">Nos últimos 12 meses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Captação por Segmento</CardTitle>
            <CardDescription>Distribuição de investimentos aprovados no ano atual.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="segmento"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value / 1000000}M`}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar
                    dataKey="valor"
                    fill="var(--color-valor)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader>
            <CardTitle>Atualizações Recentes</CardTitle>
            <CardDescription>Projetos recém atualizados na base do Salic.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-md animate-pulse" />
                  ))}
                </div>
              ) : (
                recentProjects.slice(0, 4).map((project) => (
                  <div
                    key={project.pronac}
                    className="flex flex-col gap-2 p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/projeto/${project.pronac}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-sm line-clamp-1">{project.nome}</div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          project.status === 'Aprovado'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200',
                        )}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono bg-slate-200 px-1 py-0.5 rounded">
                        {project.pronac}
                      </span>
                      <span>•</span>
                      <span>{formatCurrency(project.valor_aprovado)}</span>
                    </div>
                    <Progress
                      value={calculateProgress(project.valor_captado, project.valor_aprovado)}
                      className="h-1 mt-1"
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
