'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Zap, 
  PieChart, 
  CreditCard, 
  Target,
  Sparkles,
  ChevronRight,
  Users,
  Globe,
  Star,
  Check,
  Play,
  BarChart3,
  Wallet,
  Eye,
  Lock,
  Smartphone,
  Award,
  ArrowDown,
  Building2,
  ChevronsRight
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 }
}

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
}

const features = [
  {
    icon: PieChart,
    title: "Expense Analytics",
    description: "Visualize your spending patterns with interactive charts and detailed category breakdowns to understand where your money goes.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is protected with industry-standard encryption and secure authentication. We never share your personal information.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Budget Tracking",
    description: "Set budgets for different categories and get real-time notifications when you're approaching your spending limits.",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    icon: Zap,
    title: "Quick Entry",
    description: "Add transactions instantly with our streamlined interface. Categorize expenses automatically with smart suggestions.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: CreditCard,
    title: "Account Management",
    description: "Track multiple bank accounts, credit cards, and cash transactions in one unified dashboard with balance monitoring.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: Target,
    title: "Financial Goals",
    description: "Set savings targets and track your progress with visual indicators that motivate you to achieve your financial objectives.",
    gradient: "from-indigo-500 to-purple-500"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    content: "Funds Haven literally saved my business. I was bleeding money and didn't even know it. Now I've cut costs by 40% and actually KNOW where every dollar goes. Game changer!",
    rating: 5,
    highlight: "Saved $12k in 3 months"
  },
  {
    name: "Alex Rivera",
    role: "Digital Nomad",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "As someone who travels constantly, tracking expenses used to be a nightmare. Funds Haven makes it stupid simple - I just snap receipts and boom, categorized instantly! 📸✨",
    rating: 5,
    highlight: "Tracks 47 countries"
  },
  {
    name: "Maya Patel",
    role: "Medical Student",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    content: "Broke student life got REAL when I started using this. The budget alerts literally text me when I'm about to overspend on coffee ☕ Saved my semester!",
    rating: 5,
    highlight: "Budget alerts = life saver"
  }
]

const stats = [
  { value: "5000", suffix: "+", label: "Active Users" },
  { value: "2", prefix: "$", suffix: "M+", label: "Money Tracked" },
  { value: "99", suffix: "%", label: "Uptime" },
  { value: "4.6", suffix: "", label: "⭐ Rating" }
]

const trustLogos = [
  { name: "Bank of America", logo: "🏦" },
  { name: "Chase", logo: "🏛️" },
  { name: "Wells Fargo", logo: "🏢" },
  { name: "Capital One", logo: "🏦" },
  { name: "Citibank", logo: "🏛️" },
  { name: "American Express", logo: "💳" }
]

// Floating animation component
const FloatingCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ 
      y: [-10, 10, -10],
      rotate: [-1, 1, -1]
    }}
    transition={{ 
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
)

// Counting animation component
const CountingNumber = ({ value, prefix = "", suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      
      const numericValue = parseFloat(value)
      setCount(progress * numericValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [value, duration])

  // Format the display value
  const displayValue = value.includes('.') ? count.toFixed(1) : Math.floor(count)
  
  return <span>{prefix}{displayValue}{suffix}</span>
}

export default function LandingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/register')
    }
  }

  const handleSignIn = () => {
    if (session) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const handleWatchDemo = () => {
    // Add demo functionality later
    console.log('Watch demo clicked')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      {/* Animated Trust Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Moving trust elements */}
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 whitespace-nowrap text-slate-200/30 font-bold text-6xl"
        >
          SECURE • TRUSTED • ENCRYPTED • VERIFIED • PROTECTED •
        </motion.div>
        
        <motion.div
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 whitespace-nowrap text-slate-200/20 font-bold text-4xl"
        >
          BANK-LEVEL • AI-POWERED • REAL-TIME • INTELLIGENT • AWARD-WINNING •
        </motion.div>

        {/* Floating security icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-6 h-6 text-blue-200/20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {i % 4 === 0 && <Shield className="w-6 h-6" />}
            {i % 4 === 1 && <Lock className="w-6 h-6" />}
            {i % 4 === 2 && <Award className="w-6 h-6" />}
            {i % 4 === 3 && <Star className="w-6 h-6" />}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-white/20 backdrop-blur-xl bg-white/30 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Funds Haven
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-slate-700 text-sm">Welcome back!</span>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetStarted}
                >
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleGetStarted}
                >
Start Tracking
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                                <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-4 py-2 text-sm font-medium animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  🔥 Trending #1 Finance App
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight"
              >
Track, Budget,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Succeed
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-2xl"
              >
                Finally, expense tracking that doesn't suck! 🎉 Watch your money grow with smart budgets, instant alerts, and analytics so beautiful you'll actually want to check them. 
                Join 5,000+ people who went from financial chaos to total money control.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 items-start"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl h-16 px-10 text-lg font-semibold group transition-all duration-300 hover:scale-105"
                  onClick={handleGetStarted}
                >
                  {session ? 'Go to Dashboard' : 'Start Free Trial'}
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                {!session && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWatchDemo}
                    className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Play className="w-7 h-7 text-blue-600 ml-1" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Watch Demo</div>
                      <div className="text-sm text-slate-500">2 min overview</div>
                    </div>
                  </motion.button>
                )}
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center space-x-8 pt-8"
              >
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-slate-900">5,000+ happy users</div>
                    <div className="flex items-center">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                                              <span className="ml-2 text-sm text-slate-600">4.6/5 rating</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Main Dashboard Preview */}
              <FloatingCard delay={0}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg"></div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Total Balance</div>
                        <div className="text-xs text-slate-500">All Accounts</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">$24,750</div>
                      <div className="text-sm text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.5%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {['Checking', 'Savings', 'Investment'].map((account, i) => (
                      <div key={account} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                            i === 0 ? 'from-blue-400 to-blue-500' :
                            i === 1 ? 'from-green-400 to-green-500' :
                            'from-purple-400 to-purple-500'
                          }`}></div>
                          <span className="font-medium text-slate-700">{account}</span>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ${i === 0 ? '8,420' : i === 1 ? '12,500' : '3,830'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Stats Cards */}
              <FloatingCard delay={1}>
                <motion.div 
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-xs font-medium opacity-90">This Month</div>
                  <div className="text-lg font-bold">+$1,240</div>
                  <div className="text-xs opacity-75">Saved</div>
                </motion.div>
              </FloatingCard>

              <FloatingCard delay={2}>
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-xl"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-xs font-medium opacity-90">Goal Progress</div>
                  <div className="text-lg font-bold">68%</div>
                  <div className="text-xs opacity-75">Vacation Fund</div>
                </motion.div>
              </FloatingCard>


            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white/60 backdrop-blur-sm border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-slate-600 text-lg mb-8">Trusted by leading financial institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {trustLogos.map((logo, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 text-slate-600"
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-2xl">{logo.logo}</span>
                  <span className="font-semibold">{logo.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  <CountingNumber 
                    value={stat.value} 
                    prefix={stat.prefix || ""} 
                    suffix={stat.suffix || ""} 
                  />
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Succeed Financially
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive suite of tools and features is designed to make managing your finances 
              effortless, insightful, and rewarding.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeIn}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-slate-600 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              🚀 Real Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                5,000+ People
              </span>{' '}
              Are Obsessed 🤩
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real people, real results, real talk. No fake testimonials here! 💯
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                        {testimonial.highlight}
                      </Badge>
                    </div>
                    <blockquote className="text-slate-700 text-lg leading-relaxed mb-6">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-blue-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-slate-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-600/30"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Journey Today
            </Badge>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Financial Life?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
              Join thousands of users who've simplified their financial management. 
              Start tracking your expenses today and see the difference in your spending habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-2xl h-16 px-10 text-lg font-semibold group transition-all duration-300 hover:scale-105"
                onClick={handleGetStarted}
              >
                {session ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!session && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-16 px-10 text-lg font-semibold"
                  onClick={handleWatchDemo}
                >
                  <Play className="mr-3 w-6 h-6" />
                  Watch Demo
                </Button>
              )}
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8 text-blue-100">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Funds Haven</span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Your trusted partner in financial success. Transform your relationship with money 
                and build the future you deserve.
              </p>
              <div className="flex items-center space-x-4 mt-6">
                <div className="flex items-center text-slate-400">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <Award className="w-5 h-5 mr-2" />
                  <span>Award-winning platform</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Funds Haven. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 