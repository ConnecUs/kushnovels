
import React from 'react';
import { Book, Users, Bookmark, FileText, ChevronLeft, ChevronRight, Home, Settings, PenLine, Star, Moon, Sun, ServerCog } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const navItems = [
    { id: 'editor', label: 'Editor', icon: PenLine },
    { id: 'chapters', label: 'Chapters', icon: Book },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'prompts', label: 'Prompts', icon: Bookmark },
    { id: 'ai-assistant', label: 'AI Assistant', icon: FileText },
    { id: 'ai-settings', label: 'AI Settings', icon: ServerCog },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shadow-sidebar",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-sidebar-accent to-sidebar-background">
        {!collapsed && (
          <div className="font-serif text-lg font-semibold truncate flex items-center gap-2">
            <Star size={20} className="text-primary fill-primary/30" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {project.title}
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hover:bg-sidebar-accent/50 transition-all duration-300",
            collapsed ? "ml-auto" : "ml-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight size={18} className="text-sidebar-foreground/70 hover:text-primary" />
          ) : (
            <ChevronLeft size={18} className="text-sidebar-foreground/70 hover:text-primary" />
          )}
        </Button>
      </div>

      <nav className="flex-1 py-4 space-y-3 overflow-y-auto px-3">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start nav-item",
              activeTab === item.id 
                ? "bg-primary/10 text-primary hover:bg-primary/15" 
                : "hover:bg-sidebar-accent/30 text-sidebar-foreground/80 hover:text-sidebar-foreground",
              collapsed ? "px-3" : "px-4",
              "transition-all duration-300 overflow-hidden group"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon 
              size={20} 
              className={cn(
                collapsed ? "mx-auto" : "mr-3",
                "transition-all duration-300",
                activeTab === item.id 
                  ? "text-primary" 
                  : "text-sidebar-foreground/70 group-hover:text-primary"
              )} 
            />
            {!collapsed && (
              <span className={cn(
                "transition-all duration-300",
                activeTab === item.id ? "font-medium" : ""
              )}>
                {item.label}
              </span>
            )}
            {activeTab === item.id && !collapsed && (
              <div className="ml-auto flex items-center justify-center rounded-full bg-primary/20 w-6 h-6">
                <Star size={12} className="text-primary fill-primary/50" />
              </div>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex space-x-2 justify-around">
          <Button 
            variant="ghost" 
            size="icon" 
            title="Home"
            className="hover:bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-primary transition-colors duration-300"
          >
            <Home size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Toggle Theme"
            className="hover:bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-primary transition-colors duration-300"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Settings"
            className="hover:bg-sidebar-accent/30 text-sidebar-foreground/70 hover:text-primary transition-colors duration-300"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
