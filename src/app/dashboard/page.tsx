import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { redirect } from "next/navigation"
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Settings, 
  Plus, 
  CheckCircle, 
  Clock, 
  Flame,
  BarChart3,
  Home,
  BookOpen,
  Dumbbell,
  Brain
} from "lucide-react"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

async function getDashboardData(userId: string) {
  const [
    { data: habits },
    { data: todayLogs },
    { data: recentLogs },
    { data: categories }
  ] = await Promise.all([
    supabase
      .from('habits')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('habit_logs')
      .select('*, habits(name)')
      .eq('user_id', userId)
      .gte('completed_at', new Date().toISOString().split('T')[0])
      .order('completed_at', { ascending: false }),
    supabase
      .from('habit_logs')
      .select('*, habits(name)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10),
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
  ])

  return { habits: habits || [], todayLogs: todayLogs || [], recentLogs: recentLogs || [], categories: categories || [] }
}

async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()
    
  return userProfile
}

function getCategoryIcon(iconName: string) {
  const icons: Record<string, any> = {
    home: Home,
    book: BookOpen,
    dumbbell: Dumbbell,
    brain: Brain,
    target: Target
  }
  return icons[iconName] || Target
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const { habits, todayLogs, recentLogs, categories } = await getDashboardData(user.id)

  const totalHabits = habits.length
  const completedToday = todayLogs.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
  const currentStreaks = habits.map(h => h.current_streak).reduce((a, b) => a + b, 0)
  const longestStreak = Math.max(...habits.map(h => h.longest_streak), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b">
          <div className="flex items-center space-x-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-gray-900">StreakMaster</span>
          </div>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/habits" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Target className="mr-3 h-5 w-5" />
              Habits
            </Link>
            <Link 
              href="/dashboard/analytics" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>
            <Link 
              href="/dashboard/groups" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Users className="mr-3 h-5 w-5" />
              Groups
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
              <p className="text-gray-600 mt-1">Here's your habit progress for today</p>
            </div>
            <Link 
              href="/dashboard/habits/new"
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Habit
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold text-gray-900">{totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{completedToday}/{totalHabits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Flame className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Longest Streak</p>
                <p className="text-2xl font-bold text-gray-900">{longestStreak} days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Habits */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Active Habits</h2>
                <Link 
                  href="/dashboard/habits" 
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {habits.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No habits yet</h3>
                  <p className="mt-2 text-sm text-gray-600">Get started by creating your first habit</p>
                  <Link 
                    href="/dashboard/habits/new"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Habit
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {habits.slice(0, 5).map((habit) => {
                    const IconComponent = getCategoryIcon(habit.categories?.icon || 'target')
                    const isCompletedToday = todayLogs.some(log => log.habit_id === habit.id)
                    
                    return (
                      <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${habit.categories?.color || 'bg-gray-100'}`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{habit.name}</h3>
                            <p className="text-sm text-gray-600">
                              {habit.current_streak} day streak
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isCompletedToday ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                          )}
                          <span className="text-sm text-gray-500">
                            {habit.preferred_time}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              {recentLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No activity yet</h3>
                  <p className="mt-2 text-sm text-gray-600">Complete your first habit to see activity here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Completed {log.habits?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.completed_at).toLocaleDateString()} at{' '}
                          {new Date(log.completed_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}