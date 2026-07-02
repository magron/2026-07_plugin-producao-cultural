export interface SalicProject {
  pronac: string
  nome: string
  proponente: string
  valor_aprovado: number
  valor_captado: number
  status: string
  segmento: string
  area: string
  uf: string
  resumo: string
}

export interface SalicResponse<T> {
  data: T
  isFallback: boolean
  error?: string
}

export const MOCK_PROJECTS: SalicProject[] = [
  {
    pronac: '212345',
    nome: 'Festival de Jazz de Ouro Preto - 3ª Edição',
    proponente: 'Associação Cultural Notas Mineiras',
    valor_aprovado: 1250000.0,
    valor_captado: 850000.0,
    status: 'Em Captação',
    segmento: 'Música Instrumental',
    area: 'Música',
    uf: 'MG',
    resumo: 'Realização de festival gratuito de jazz em praças públicas de Ouro Preto.',
  },
  {
    pronac: '204567',
    nome: 'Restauração do Casarão Histórico Silva',
    proponente: 'Instituto do Patrimônio Histórico Viver',
    valor_aprovado: 3400000.0,
    valor_captado: 3400000.0,
    status: 'Aprovado',
    segmento: 'Patrimônio Material',
    area: 'Patrimônio Cultural',
    uf: 'BA',
    resumo:
      'Obras de restauro completo do imóvel tombado datado do século XVIII no centro histórico.',
  },
  {
    pronac: '221980',
    nome: 'Circuito Nacional de Teatro Itinerante',
    proponente: 'Cia. Arte e Expressão Ltda',
    valor_aprovado: 890000.0,
    valor_captado: 150000.0,
    status: 'Em Captação',
    segmento: 'Teatro',
    area: 'Artes Cênicas',
    uf: 'SP',
    resumo: 'Circulação de peça teatral por 15 cidades do interior de São Paulo.',
  },
  {
    pronac: '190034',
    nome: 'Exposição Raízes do Brasil',
    proponente: 'Museu de Arte Contemporânea',
    valor_aprovado: 2100000.0,
    valor_captado: 2100000.0,
    status: 'Encerrado',
    segmento: 'Artes Visuais',
    area: 'Artes Visuais',
    uf: 'RJ',
    resumo: 'Exposição imersiva retratando a história da cultura popular brasileira.',
  },
  {
    pronac: '230112',
    nome: 'Bienal do Livro Infantil',
    proponente: 'Editora Letras & Sonhos',
    valor_aprovado: 500000.0,
    valor_captado: 0.0,
    status: 'Aprovado',
    segmento: 'Literatura',
    area: 'Humanidades',
    uf: 'PR',
    resumo: 'Feira literária focada na formação de novos leitores nas escolas públicas.',
  },
]

const mapSalicToProject = (p: any): SalicProject => ({
  pronac: p.PRONAC || p.pronac,
  nome: p.nome,
  proponente: p.proponente,
  valor_aprovado:
    typeof p.valor_aprovado === 'string' ? parseFloat(p.valor_aprovado) : p.valor_aprovado,
  valor_captado:
    typeof p.valor_captado === 'string' ? parseFloat(p.valor_captado) : p.valor_captado,
  status: p.situacao || p.status,
  segmento: p.segmento,
  area: p.area,
  uf: p.UF || p.uf,
  resumo: p.resumo,
})

export async function fetchProjects(query?: string): Promise<SalicResponse<SalicProject[]>> {
  try {
    const url = query
      ? `https://api.salic.cultura.gov.br/api/v1/projetos/?limit=15&nome=${encodeURIComponent(query)}`
      : 'https://api.salic.cultura.gov.br/api/v1/projetos/?limit=15'

    const res = await fetch(url)
    if (!res.ok) throw new Error('API Salic offline ou bloqueada')

    const data = await res.json()
    if (data && data._embedded && data._embedded.projetos) {
      return { data: data._embedded.projetos.map(mapSalicToProject), isFallback: false }
    }
    throw new Error('Formato inesperado da API')
  } catch (err) {
    console.warn('Usando dados mockados (Falha na API Salic)', err)
    let results = [...MOCK_PROJECTS]
    if (query) {
      const q = query.toLowerCase()
      results = results.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          p.pronac.includes(q) ||
          p.proponente.toLowerCase().includes(q),
      )
    }
    return {
      data: results,
      isFallback: true,
      error: 'Não foi possível conectar à API do SALIC. Exibindo dados de demonstração.',
    }
  }
}

export async function fetchProjectById(
  pronac: string,
): Promise<SalicResponse<SalicProject | null>> {
  try {
    const res = await fetch(`https://api.salic.cultura.gov.br/api/v1/projetos/${pronac}`)
    if (!res.ok) throw new Error('Projeto não encontrado na API')
    const data = await res.json()
    return { data: mapSalicToProject(data), isFallback: false }
  } catch (err) {
    console.warn('Usando dados mockados para o projeto', err)
    return {
      data: MOCK_PROJECTS.find((p) => p.pronac === pronac) || null,
      isFallback: true,
      error: 'Não foi possível conectar à API do SALIC. Exibindo dados de demonstração.',
    }
  }
}
