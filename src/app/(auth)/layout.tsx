export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[#fafafa] px-4 py-12">
      {children}
    </div>
  );
}
