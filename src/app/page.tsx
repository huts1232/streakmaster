'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { CheckCircle, Target, Users, BarChart3, Trophy, Star, ArrowRight, Play } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Stats {
  totalUsers: number
  totalHabits: number
  totalStreaks: number
}

interface Testimonial {
  name: string
  title: string
  content: string
  rating: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalHabits: 0, totalStreaks: 0 })
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [usersRes, habitsRes, logsRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('habits').select('id', { count: 'exact', head: true }),
        supabase.from('habit_logs').select('habit_id').neq('completed_at', null)
      ])

      const totalStreaks = logsRes.data?.length || 0

      setStats({
        totalUsers: usersRes.count || 0,
        totalHabits: habitsRes.count || 0,
        totalStreaks
      })

      // Mock testimonials for now since we don't have a testimonials table
      setTestimonials([
        {
          name: "Sarah Chen",
          title: "Product Manager",
          content: "StreakMaster helped me build a consistent morning routine. I've maintained my reading habit for 87 days straight!",
          rating: 5
        },
        {
          name: "Mike Rodriguez",
          title: "Software Engineer",
          content: "The visual streak tracking is incredibly motivating. I've never stuck to habits this long before.",
          rating: 5
        },
        {
          name: "Emily Johnson",
          title: "Marketing Director",
          content: "Finally, a habit tracker that works with my busy schedule. The AI recommendations are spot-on.",
          rating: 5
        }
      ])
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      // In a real app, you'd save this to a newsletter/waitlist table
      setEmailSubmitted(true)
      setEmail('')
    } catch (error) {
      console.error('Error submitting email:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StreakMaster</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Unbreakable
              <span className="block text-yellow-300">Daily Habits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-indigo-100">
              Transform your routine with visual streak tracking designed for busy professionals. 
              Build consistency that lasts with AI-powered insights and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="text-white border border-white/30 px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center">
                <Play className="mr-2 h-5 w-5" /> Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {loading ? '...' : stats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {loading ? '...' : stats.totalHabits.toLocaleString()}+
              </div>
              <div className="text-gray-600">Habits Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                {loading ? '...' : stats.totalStreaks.toLocaleString()}+
              </div>
              <div className="text-gray-600">Streaks Achieved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Lasting Habits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Designed specifically for busy professionals who want to build consistency without complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visual Streak Tracking</h3>
              <p className="text-gray-600">See your progress with beautiful visual streaks that motivate you to keep going</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
              <p className="text-gray-600">Get insights into your patterns and optimize your habits with data-driven recommendations</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">Join groups with like-minded professionals and stay motivated together</p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievement System</h3>
              <p className="text-gray-600">Celebrate milestones and unlock achievements as you build lasting habits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about building habits with StreakMaster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready to unlock advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Track up to 3 habits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic streak tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Simple analytics</span>
                  </li>
                </ul>
                <Link href="/auth/signup" className="block w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center">
                  Get Started Free
                </Link>
              </div>
            </div>

            <div className="bg-indigo-600 text-white rounded-lg p-8 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-1">$5</div>
                <div className="text-indigo-200 mb-4">per month</div>
                <p className="text-indigo-100 mb-6">For serious habit builders</p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>Unlimited habits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>AI-powered recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>Community groups</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>Smart notifications</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-yellow-400 mr-3" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link href="/auth/signup?plan=pro" className="block w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center">
                  Start Pro Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Unbreakable Habits?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their routines with StreakMaster
          </p>
          
          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                Thanks! We'll keep you updated.
              </div>
              <Link href="/auth/signup" className="bg-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-block">
                Start Building Habits Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Target className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">StreakMaster</span>
            </div>
            <div className="text-gray-600">
              © 2024 StreakMaster. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}