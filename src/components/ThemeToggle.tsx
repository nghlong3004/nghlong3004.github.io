import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const cycle = () => {
        const next =
            theme === 'dark'
                ? 'light'
                : theme === 'light'
                  ? 'system'
                  : 'dark';
        setTheme(next);
    };

    const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
    const label =
        theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

    return (
        <button
            onClick={cycle}
            className="size-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 active:scale-95 transition-all"
            aria-label={`Theme: ${label}`}
            title={label}
        >
            <Icon size={18} />
        </button>
    );
};

export default ThemeToggle;
