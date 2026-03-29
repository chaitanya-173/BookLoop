import React from "react";
import { FolderTree, FileCode2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-slate-900 border-r border-white/10 p-5 flex flex-col">
      
      <h1 className="text-xl font-semibold mb-6 tracking-wide">
        Snipbox
      </h1>

      {/* Navigation */}
      <div className="space-y-3">
        <SidebarItem icon={<FolderTree size={20} />} label="Folders" />
        <SidebarItem icon={<FileCode2 size={20} />} label="Snippets" />
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
      </div>

      {/* Future — bottom section */}
      <div className="mt-auto text-slate-600 text-sm text-center">
        v1.0.0
      </div>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800 cursor-pointer transition">
      {icon}
      <span className="text-slate-300">{label}</span>
    </div>
  );
}
