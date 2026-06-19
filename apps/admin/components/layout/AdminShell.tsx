import { auth } from '../../auth'
import { redirect } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

interface AdminShellProps {
  children: React.ReactNode
  title: string
}

export async function AdminShell({ children, title }: AdminShellProps) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const userName = session.user.name ?? 'Admin'
  const userRole = (session.user as { role: string }).role ?? 'EDITEUR'

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userName={userName} userRole={userRole} />
      <div className="pl-60">
        <TopBar title={title} userName={userName} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
