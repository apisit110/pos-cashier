import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'

export default function Home () {
  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground selection:bg-accent selection:text-white'>
      {/* Header */}
      <nav className='flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full'>
        <div className='flex items-center gap-2'>
          <Zap className='w-8 h-8 text-accent fill-accent' />
          <span className='text-2xl font-bold font-heading tracking-tight'>LIGHTNING</span>
        </div>
        <div className='hidden md:flex items-center gap-8 text-sm font-medium'>
          <a href='#' className='hover:text-accent transition-colors'>Features</a>
          <a href='#' className='hover:text-accent transition-colors'>Pricing</a>
          <a href='#' className='hover:text-accent transition-colors'>Resources</a>
          <button className='bg-accent text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity'>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className='flex-grow flex flex-col items-center justify-center px-4 relative overflow-hidden'>
        {/* Background Decorative Gradients */}
        <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -z-10' />
        <div className='absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -z-10' />

        <div className='max-w-4xl w-full text-center space-y-8 py-20'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-bold tracking-widest uppercase mb-4'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-accent'></span>
            </span>
            Next-Gen POS Experience
          </div>
          
          <h1 className='text-5xl md:text-7xl font-extrabold font-heading tracking-tight leading-[1.1]'>
            Scale your business with <span className='text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500'>Lightning Speed</span>
          </h1>
          
          <p className='text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed'>
            A premium, high-performance portal designed for modern merchants. Manage operations, track sales, and grow faster than ever.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
            <button className='flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-accent/20'>
              Get Started Free <ArrowRight className='w-5 h-5' />
            </button>
            <button className='flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-foreground/10 rounded-2xl font-bold hover:bg-foreground/5 transition-all'>
              Book a Demo
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full py-20'>
          {[
            { icon: Zap, title: 'Ultra Fast', desc: 'Real-time synchronization across all your POS terminals.' },
            { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security and PII encryption by default.' },
            { icon: BarChart3, title: 'Analytics', desc: 'Deep insights and reporting to drive your decisions.' }
          ].map((feature, i) => (
            <div key={i} className='p-8 rounded-3xl border border-foreground/5 bg-foreground/[0.02] backdrop-blur-sm hover:border-accent/20 transition-colors group'>
              <feature.icon className='w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform' />
              <h3 className='text-xl font-bold font-heading mb-2'>{feature.title}</h3>
              <p className='text-foreground/60 leading-relaxed'>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-foreground/5 py-10 px-8'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='text-sm text-foreground/40'>© 2026 Lightning POS. All rights reserved.</p>
          <div className='flex gap-8 text-sm font-medium text-foreground/40'>
            <a href='#' className='hover:text-foreground transition-colors'>Privacy Policy</a>
            <a href='#' className='hover:text-foreground transition-colors'>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
