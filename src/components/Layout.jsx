export default function Layout({ children }) {
  return (
  <div className="relative min-h-screen bg-[var(--bg)]">
      <main>
        {children}
      </main>
    </div>
  );
}

