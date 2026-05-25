export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-default-100 flex items-center justify-center">
      {children}
    </div>
  );
}
