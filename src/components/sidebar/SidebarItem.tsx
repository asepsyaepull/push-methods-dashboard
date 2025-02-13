const SidebarItem = ({ icon, text, count, active }: { icon: React.ReactNode; text: string; count?: number; active?: boolean }) => {
  return (
    <a
      href="#"
      className={`flex items-center justify-between px-3 py-2 rounded-lg ${active ? "bg-orange-50 text-orange-500" : "hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{text}</span>
      </div>
      {count && (
        <span className={`text-sm ${active ? "text-orange-500" : "text-gray-500"}`}>
          {count}
        </span>
      )}
    </a>
  );
};

export default SidebarItem;
