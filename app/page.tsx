import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-xl sm:text-2xl">
          <i className="bi bi-rocket-takeoff-fill text-2xl sm:text-3xl"></i>
          Project 31
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/login"
            className="text-white hover:text-white/80 px-4 py-2 font-medium transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 bg-white/20 backdrop-blur-sm rounded-3xl mb-4 sm:mb-6 shadow-2xl border border-white/30">
          <i className="bi bi-rocket-takeoff-fill text-white text-4xl sm:text-6xl"></i>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 sm:mb-4 text-center drop-shadow-lg">
          Project 31
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 text-center px-4 max-w-2xl">
          Welcome to my awesome website. Get started by creating an account or signing in.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 mb-12">
          <Link
            href="/login"
            className="bg-white text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-100 active:scale-95 transition shadow-lg text-base sm:text-lg text-center flex items-center justify-center gap-2"
          >
            <i className="bi bi-box-arrow-in-right text-xl"></i>
            Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-purple-900 active:scale-95 transition shadow-lg text-base sm:text-lg border-2 border-white/30 text-center flex items-center justify-center gap-2"
          >
            <i className="bi bi-person-plus-fill text-xl"></i>
            Register
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
              <i className="bi bi-shield-check text-white text-2xl"></i>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Secure</h3>
            <p className="text-white/80 text-sm">Protected with modern security</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
              <i className="bi bi-lightning-charge-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Fast</h3>
            <p className="text-white/80 text-sm">Lightning quick performance</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/20 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3">
              <i className="bi bi-phone-fill text-white text-2xl"></i>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Responsive</h3>
            <p className="text-white/80 text-sm">Works on all devices</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-white/70 text-xs sm:text-sm flex items-center justify-center gap-2">
        <i className="bi bi-heart-fill text-red-300"></i>
        Made with Next.js + Tailwind CSS
      </footer>
    </div>
  );
}