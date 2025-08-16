import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BoardList from '@/components/BoardList'
import CreateBoardButton from '@/components/CreateBoardButton'
import UserMenu from '@/components/UserMenu'

export default async function BoardsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select(`
      *,
      boards (*)
    `)
    .or(`owner_id.eq.${user.id},id.in.(select workspace_id from workspace_members where user_id='${user.id}')`)

  const { data: personalBoards } = await supabase
    .from('boards')
    .select('*')
    .eq('created_by', user.id)
    .is('workspace_id', null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Trallo</h1>
            </div>
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Boards</h2>
            <CreateBoardButton />
          </div>
          
          {personalBoards && personalBoards.length > 0 ? (
            <BoardList boards={personalBoards} />
          ) : (
            <p className="text-gray-500">No personal boards yet. Create your first board!</p>
          )}
        </div>

        {workspaces && workspaces.map((workspace) => (
          <div key={workspace.id} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {workspace.name}
            </h2>
            {workspace.boards && workspace.boards.length > 0 ? (
              <BoardList boards={workspace.boards} />
            ) : (
              <p className="text-gray-500">No boards in this workspace yet.</p>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}