import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: Rota não encontrada:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-6 p-8 bg-white border rounded-xl shadow-sm">
        <h1 className="text-6xl font-bold text-amber-700">404</h1>
        <p className="text-xl text-slate-600 font-medium">Ops! Página não encontrada</p>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          O recurso que você está tentando acessar não existe ou foi movido.
        </p>
        <Button asChild className="mt-4 bg-slate-800 hover:bg-slate-700">
          <Link to="/">Voltar ao Painel</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
