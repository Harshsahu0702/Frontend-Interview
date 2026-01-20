import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet, useParams } from 'react-router-dom';
import { BlogList } from '@/pages/BlogList';
import { BlogDetail } from '@/pages/BlogDetail';
import { CreateBlog } from '@/pages/CreateBlog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { motion, useScroll } from 'framer-motion';
import { Search, Bell, User, PenSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

function Header() {
  const location = useLocation();
  const isCreatePage = location.pathname === '/create';
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20
        }
      }}
      className={cn(
        "sticky top-0 z-50 w-full px-4 md:px-8 py-4 transition-all duration-300",
        isScrolled ? "pt-2" : "pt-4"
      )}
    >
      <div className={cn(
        "mx-auto max-w-7xl rounded-2xl border transition-all duration-300 flex items-center justify-between px-6 h-16 sm:h-20",
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-white/40 shadow-lg w-full"
          : "bg-white/40 backdrop-blur-md border-white/20 shadow-sm w-full"
      )}>
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="bg-gradient-to-tr from-primary to-purple-400 text-white p-2.5 rounded-xl font-black text-xl shadow-lg ring-4 ring-primary/10"
          >
            CA
          </motion.div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none group-hover:text-primary transition-colors">CA Monk</span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Community Blog</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/50 p-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-inner">
          {['Home', 'Discover', 'Podcasts', 'Jobs'].map((item) => (
            <Button key={item} variant="ghost" size="sm" className="rounded-full text-gray-600 hover:text-primary hover:bg-white shadow-none hover:shadow-sm transition-all font-medium">
              {item}
            </Button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:text-primary hover:bg-primary/10 hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full text-gray-500 hover:text-primary hover:bg-primary/10 hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>

          <Link to="/create">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className={cn(
                  "gap-2 rounded-full font-bold shadow-lg shadow-primary/25 transition-all",
                  isCreatePage
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-gradient-to-r from-primary to-purple-600 hover:brightness-110 border-0"
                )}
              >
                <PenSquare className="h-4 w-4" /> <span className="hidden sm:inline">Write</span>
              </Button>
            </motion.div>
          </Link>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 p-0 overflow-hidden ring-2 ring-white shadow-md">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-full h-full flex items-center justify-center text-gray-500">
              <User className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

function MasterDetailLayout() {
  const { id } = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
      {/* List Panel - Hidden on mobile if we are viewing a specific blog */}
      <div className={cn(
        "md:col-span-4 h-full overflow-hidden flex flex-col",
        id ? "hidden md:flex" : "flex"
      )}>
        <BlogList />
      </div>

      {/* Detail Panel - Hidden on mobile if we are NOT viewing a specific blog (unless it's just placeholder which we might hide on mobile) */}
      <div className={cn(
        "md:col-span-8 h-full overflow-y-auto custom-scrollbar",
        !id ? "hidden md:block" : "block"
      )}>
        <Outlet />
      </div>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="h-full bg-muted/20 rounded-xl border p-8 flex items-center justify-center text-center">
      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <PenSquare className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Select a blog</h2>
        <p className="text-muted-foreground">Click on an article from the left to view details.</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans antialiased text-foreground relative selection:bg-purple-500/30">
        <AnimatedBackground />
        <Header />
        <main className="w-full px-4 md:px-8 lg:px-12 py-6">
          <Routes>
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/" element={<MasterDetailLayout />}>
              <Route index element={<Placeholder />} />
              <Route path="blog/:id" element={<BlogDetail />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
