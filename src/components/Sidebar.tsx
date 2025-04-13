
import React, { useState } from 'react';
import { Book, Users, Bookmark, FileText, ChevronLeft, ChevronRight, Home, Settings, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface SidebarProps {
  project: Project;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  project, 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed 
}) => {
  const navItems = [
    { id: 'editor', label: 'Editor', icon: PenLine },
    { id: 'chapters', label: 'Chapters', icon: Book },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'notes', label: 'Notes', icon: Bookmark },
    { id: 'ai-assistant', label: 'AI Assistant', icon: FileText },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h2 className="font-serif text-lg font-semibold truncate">
            {project.title}
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              collapsed ? "px-3" : "px-4"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} className={collapsed ? "mx-auto" : "mr-2"} />
            {!collapsed && <span>{item.label}</span>}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" title="Home">
            <Home size={18} />
          </Button>
          <Button variant="ghost" size="icon" title="Settings">
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
