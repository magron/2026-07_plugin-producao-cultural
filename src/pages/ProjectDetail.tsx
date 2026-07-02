import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Download, Building2, MapPin, Tag, Building, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { useProjectDetail } from '@/hooks/use-salic'
import { formatCurrency, calculateProgress } from '@/lib/utils'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: project, isLoading } = useProjectDetail(id)

  const handleCopyPronac = () => {
    if (project?.pronac) {
      navigator.clipboard.writeText(project.pronac)
      toast({
        title: 'PRONAC copiado!',
        description: 'Número copiado para a área de transferência.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-[400px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Projeto não encontrado</h2>
        <Button onClick={() => navigate('/busca')}>Voltar para busca</Button>
      </div>
    )
  }

  const progress = calculateProgress(project.valor_captado, project.valor_aprovado)

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              {project.nome}
            </h1>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              {project.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md font-mono text-slate-700">
              PRONAC: {project.pronac}
              <Copy
                className="h-3.5 w-3.5 cursor-pointer hover:text-slate-900"
                onClick={handleCopyPronac}
              />
            </div>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {project.uf}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" /> {project.segmento}
            </span>
          </div>
        </div>
        <div className="ml-auto hidden sm:flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1">
              <TabsTrigger value="geral">Visão Geral</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="geral" className="mt-4 space-y-4">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-700" /> Resumo do Projeto
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 leading-relaxed">
                  {project.resumo || 'Nenhum resumo disponível para este projeto.'}
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Área Cultural
                    </span>
                    <span className="font-medium text-slate-900">{project.area}</span>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Segmento
                    </span>
                    <span className="font-medium text-slate-900">{project.segmento}</span>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="mt-4">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Situação Financeira</CardTitle>
                  <CardDescription>
                    Acompanhamento de captação de recursos aprovados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Valor Aprovado</div>
                      <div className="text-3xl font-bold text-slate-900">
                        {formatCurrency(project.valor_aprovado)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-500 mb-1">Valor Captado</div>
                      <div className="text-3xl font-bold text-green-700">
                        {formatCurrency(project.valor_captado)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Progresso da Captação</span>
                      <span className="text-amber-700">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="mt-4">
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Linha do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-500 italic">
                    Histórico detalhado indisponível nesta demonstração.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 bg-slate-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" /> Proponente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="font-semibold text-slate-900">{project.proponente}</div>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" /> Instituição Cultural
                </div>
              </div>
              <Button
                className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                variant="default"
              >
                Ver Perfil Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
