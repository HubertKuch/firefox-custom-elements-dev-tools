import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { VirtualHtmlNode } from '@types/node';

interface NodeRendererProps {
  node: VirtualHtmlNode;
  depth?: number;
}

export const HtmlNodeRenderer = ({ node, depth = 0 }: NodeRendererProps): JSX.Element => {
  const hasChildren = !!(node.children && node.children.length > 0);
  const [isOpen, setIsOpen] = useState<boolean>(depth < 3); // Default open top layers
  
  const tagLower = node.tagName.toLowerCase();

  const toggleOpen = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (!hasChildren) return;
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="font-mono text-xs leading-relaxed select-none whitespace-nowrap w-fit min-w-full">
      {/* Node Tag Line */}
      <div 
        onClick={toggleOpen}
        className={`group flex items-center py-0.5 px-1.5 rounded-sm transition-colors duration-75
          ${hasChildren ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800' : ''}`}
        style={{ paddingLeft: `${(depth * 16) + 6}px` }}
      >
        {/* Minimalist expand triangle arrow */}
        {hasChildren ? (
          <svg 
            className={`w-3 h-3 text-gray-400 mr-1 transition-transform duration-100 transform ${isOpen ? 'rotate-90' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <div className="w-4" /> // Alignment spacer
        )}

        {/* Tag Name only */}
        <span className="text-blue-600 dark:text-blue-400">
          &lt;<span className="font-semibold">{tagLower}</span>&gt;
        </span>

        {/* Dynamic closing placeholder snippet when collapsed */}
        {!isOpen && hasChildren && (
          <span className="text-gray-400 text-[11px] px-1 bg-gray-100 dark:bg-neutral-800 rounded mx-0.5 font-sans">
            ···
          </span>
        )}

        {/* Immediate Closing Tag for collapsed nodes or nodes without children */}
        {(!isOpen || !hasChildren) && (
          <span className="text-blue-600 dark:text-blue-400">
            &lt;/<span className="font-semibold">{tagLower}</span>&gt;
          </span>
        )}
      </div>

      {/* Children Node Scope block */}
      {hasChildren && isOpen && (
        <>
          <div className="border-l border-gray-200/50 dark:border-neutral-800/70 ml-[13px]">
            {node.children?.map((childNode, index) => (
              <HtmlNodeRenderer key={index} node={childNode} depth={depth + 1} />
            ))}
          </div>

          {/* Dedicated Outro Closing Tag for structural clarity */}
          <div 
            className="text-blue-600 dark:text-blue-400 py-0.5 px-1.5"
            style={{ paddingLeft: `${(depth * 16) + 22}px` }}
          >
            &lt;/<span className="font-semibold">{tagLower}</span>&gt;
          </div>
        </>
      )}
    </div>
  );
};
