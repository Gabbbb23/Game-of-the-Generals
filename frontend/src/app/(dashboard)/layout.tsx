import NavBar from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <NavBar/>
      <main className="min-h-screen w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}


const example = () => (
  <>
    nigga
  </>
)