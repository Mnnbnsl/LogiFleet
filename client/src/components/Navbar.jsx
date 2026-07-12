import { Search, Bell, SunMoon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchVal = searchParams.get('search') || '';

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Guest User", role: "Viewer" };

  const getInitials = (name) => {
    if (!name) return "";
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  const handleSearchChange = (e) => {
    setSearchParams((prev) => {
      if (e.target.value) {
        prev.set('search', e.target.value);
      } else {
        prev.delete('search');
      }
      return prev;
    });
  };

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-3xl bg-slate-100 p-3 text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
            <Search className="h-4 w-4" />
          </div>
          <input
            placeholder="Search reports, trips, fuel logs..."
            value={searchVal}
            onChange={handleSearchChange}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-3xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <SunMoon className="h-5 w-5" />
          </button>
          <button className="rounded-3xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5B301]/15 text-sm font-semibold text-[#D89E00] dark:text-[#F5B301]">
              {getInitials(user.name)}
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{formatRole(user.role)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
