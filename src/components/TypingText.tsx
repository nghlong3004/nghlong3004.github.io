import { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    highlightWord?: string;
    showCursor?: boolean;
}

export default function TypingText({
    text,
    speed = 20,
    delay = 0,
    className = '',
    highlightWord = '',
    showCursor = true,
}: TypingTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let i = 0;
        let timer: any;
        let delayTimer: any;

        const startTyping = () => {
            timer = setInterval(() => {
                if (i < text.length) {
                    setDisplayedText(text.slice(0, i + 1));
                    i++;
                } else {
                    setIsComplete(true);
                    clearInterval(timer);
                }
            }, speed);
        };

        if (delay > 0) {
            delayTimer = setTimeout(startTyping, delay);
        } else {
            startTyping();
        }

        return () => {
            clearInterval(timer);
            clearTimeout(delayTimer);
        };
    }, [text, speed, delay]);

    // Highlight specific word if provided
    const getRenderedContent = () => {
        if (!highlightWord || !displayedText.includes(highlightWord)) {
            return displayedText;
        }
        
        // Escape special characters in highlight word just in case
        const escapedWord = highlightWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedWord})`, 'g');
        return displayedText.replace(regex, '<span class="font-medium text-foreground">$1</span>');
    };

    return (
        <span className={className}>
            {highlightWord ? (
                <span dangerouslySetInnerHTML={{ __html: getRenderedContent() }} />
            ) : (
                <span>{displayedText}</span>
            )}
            {showCursor && (!isComplete || showCursor) && (
                <span className="animate-blink border-r-2 border-primary ml-1 h-[1.1em] inline-block align-middle">&nbsp;</span>
            )}
        </span>
    );
}
