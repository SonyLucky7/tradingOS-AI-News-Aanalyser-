import React from 'react';

interface Props {
  text: string;
  className?: string;
}

// Cleanly renders AI response text without raw markdown symbols (no raw **** or #### hashes)
export const FormattedAiText: React.FC<Props> = ({ text, className = '' }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className={`space-y-2 font-mono ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header #### or ### or ##
        if (trimmed.startsWith('#')) {
          const cleanHeader = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
          return (
            <div key={idx} className="mt-3 mb-1 pt-2 border-t border-slate-800/80">
              <h4 className="text-xs font-extrabold text-trade-cyan uppercase tracking-wider flex items-center gap-1.5">
                {cleanHeader}
              </h4>
            </div>
          );
        }

        // Bullet point - or * or •
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          const cleanBullet = trimmed.replace(/^[-*•]\s*/, '');
          const parts = cleanBullet.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2 text-xs leading-relaxed text-slate-200">
              <span className="text-trade-cyan font-bold text-sm leading-none mt-0.5">•</span>
              <div className="flex-1">
                {parts.map((part, pIdx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    const boldContent = part.slice(2, -2);
                    return (
                      <strong key={pIdx} className="font-extrabold text-white bg-slate-800/60 px-1 py-0.5 rounded border border-slate-700/60 mr-1">
                        {boldContent}
                      </strong>
                    );
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            </div>
          );
        }

        // Regular paragraph with bold ** Parsing
        const parts = trimmed.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={idx} className="text-xs leading-relaxed text-slate-200">
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                const boldContent = part.slice(2, -2);
                return <strong key={pIdx} className="font-extrabold text-white">{boldContent}</strong>;
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};
