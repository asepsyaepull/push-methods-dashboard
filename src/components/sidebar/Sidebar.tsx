import { Home as HomeIcon, Package, ShoppingBag, Users, BarChart2, Percent, Settings, HelpCircle } from "lucide-react";
import Image from "next/image";
import SidebarItem from "./SidebarItem";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Image alt="Logo" loading="lazy" width="180" height="150" decoding="async" className="px-2" style={{ color: 'transparent' }} src="/logo-horizontal.svg" />
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<HomeIcon size={20} />} text="Home" count={10} />
          <SidebarItem icon={<Package size={20} />} text="Products" count={8} />
          <SidebarItem icon={<ShoppingBag size={20} />} text="Orders" />
          <SidebarItem icon={<Users size={20} />} text="Customers" active />
          <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" count={12} />
          <SidebarItem icon={<Percent size={20} />} text="Promotions" />
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 border-t">
        <nav className="p-4 space-y-1">
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<HelpCircle size={20} />} text="Support" />
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Image src="/avatar.jpg" alt="Avatar" width={32} height={32} className="rounded-full" />
            <div>
              <p className="text-sm font-medium">Asep Syaepul R</p>
              <p className="text-xs text-gray-500">asep@mail.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
