import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <h1 className="text-7xl font-bold text-white mb-4 text-center">
        Project 31 🚀
      </h1>
      <p className="text-2xl text-white/90 mb-8 text-center">
        Welcome to my website
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-lg"
        >
          Login →
        </Link>
        <Link
          href="/register"
          className="bg-purple-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-900 transition shadow-lg text-lg border-2 border-white/30"
        >
          Register
        </Link>
      </div>
    </div>
  );
}