import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/boards')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-6">Trallo</h1>
        <p className="text-xl mb-8 opacity-90">
          Project management made simple and powerful
        </p>
        <p className="text-lg mb-12 opacity-80 max-w-2xl mx-auto">
          Organize your projects with boards, lists, and cards. 
          Premium features built-in: due dates, labels, attachments, team collaboration, and more.
        </p>
        <div className="space-x-4">
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-200"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">✨ Premium Features</h3>
            <p className="opacity-90">
              Due dates, labels, attachments, checklists, and team collaboration - all included for free.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🚀 Drag & Drop</h3>
            <p className="opacity-90">
              Intuitive drag-and-drop interface to move cards and lists exactly where you need them.
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">🔒 Secure</h3>
            <p className="opacity-90">
              Your data is protected with enterprise-grade security and authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
