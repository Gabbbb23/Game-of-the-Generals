export default function NavBar() {
  return <>
    <aside className="w-32 bg-[#2f2f2f] border-r border-[#e8e8e835] p-2.5 flex flex-col">
        <nav className="flex flex-col justify-between h-full">
            <div className="space-y-1">
                <a href="/" className="block hover:bg-[#f8f9fa28] p-2 rounded"><b>Home</b></a>
                <a href="/play" className="block hover:bg-[#f8f9fa28] p-2 rounded transition-colors duration-300"><b>Play</b></a>
                </div>
                
                <div>
                <a href="/settings" className="block hover:bg-[#f8f9fa28] p-2 rounded transition-colors duration-300"><b>Settings</b></a>
            </div>
        </nav>
    </aside>
  </>
}
