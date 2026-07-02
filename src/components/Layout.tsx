import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, LayoutDashboard, Search, FileText, PieChart, Settings, User } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { title: 'Painel de Controle', icon: LayoutDashboard, path: '/' },
    { title: 'Buscar Projetos', icon: Search, path: '/busca' },
    { title: 'Minhas Propostas', icon: FileText, path: '/propostas' },
    { title: 'Monitor de Incentivos', icon: PieChart, path: '/monitor' },
  ]

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="h-16 flex items-center border-b px-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg px-2">
          <div className="bg-amber-700 text-white p-1.5 rounded-md">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span>Salic Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 font-medium transition-all hover:text-amber-700"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/configuracoes'}>
              <Link to="/configuracoes">
                <Settings className="h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-white/70 px-4 md:px-6 backdrop-blur-md sticky top-0 z-10">
            <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-slate-500 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-600 border-2 border-white" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer border border-slate-200 hover:border-amber-600 transition-colors">
                <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
