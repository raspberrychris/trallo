import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BoardView from '@/components/BoardView'

interface BoardPageProps {
  params: Promise<{ id: string }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: board, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !board) {
    redirect('/boards')
  }

  return <BoardView boardId={id} initialBoard={board} />
}