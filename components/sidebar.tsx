import Link from "next/link";
import { Home, Compass, List, Podcast, Clock } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
  ];

  const yourStuffItems = [
    { href: "/queue", label: "My Queue", icon: List },
    { href: "/podcasts", label: "My Podcasts", icon: Podcast },
    { href: "/recents", label: "Recents", icon: Clock },
  ];

  return (
    <aside className="w-64 bg-card p-2 flex flex-col space-y-8 border-r border-custom-gray h-full">
      <div>
        <Link href="/" className="flex items-center space-x-2 mb-8">
          <img
            src="/podbay-logo.png"
            alt="Podbay Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="font-bold text-xl text-primary">Podbay</span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
          Your Stuff
        </h3>
        <nav className="space-y-2">
          {yourStuffItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto text-xs text-muted-foreground space-y-1 align-start p-2 ">
        <p>Podbay v2.0.8 by Fancy Soups.</p>
        <div className="flex space-x-2">
          <Link href="/about" className="hover:text-card-foreground">
            About
          </Link>
          <span>·</span>
          <Link href="/all-podcasts" className="hover:text-card-foreground">
            All Podcasts
          </Link>
        </div>
      </div>
    </aside>
  );
}
