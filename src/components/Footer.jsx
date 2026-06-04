export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 md:px-24 border-t border-zinc-900 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-zinc-600 font-mono text-xs">
          © {new Date().getFullYear()} RICHARD ZUIKOV
        </span>
        
        <div className="flex gap-8 text-zinc-500 font-mono text-xs">
          <a href="https://github.com/Ri4ards2006" className="hover:text-white transition-colors">GITHUB</a>
          <a href="mailto:deine@email.com" className="hover:text-white transition-colors">EMAIL</a>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-700">PROD</span>
        </div>
      </div>
    </footer>
  );
}