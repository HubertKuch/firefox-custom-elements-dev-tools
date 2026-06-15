import { JSX } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import { memo } from 'preact/compat';
import { VirtualHtmlNode } from '@types/node';
import { useUIStore } from '@src/store/useUIStore';
import { useDevTools } from '@hooks/useDevTools';

interface NodeRendererProps {
  node: VirtualHtmlNode;
  depth?: number;
}

export const HtmlNodeRenderer = memo(({ node, depth = 0 }: NodeRendererProps): JSX.Element => {
  const hasChildren = !!(node.children && node.children.length > 0);
  const [isOpen, setIsOpen] = useState<boolean>(depth < 3);
  
  const isSelected = useUIStore((state) => state.currentElement === node);
  const setCurrentElement = useUIStore((state) => state.setCurrentElement);
  const openSidebar = useUIStore((state) => state.openSidebar);
  const { client } = useDevTools();
  
  const tagLower = node.tagName.toLowerCase();

  const handleSelect = useCallback((e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setCurrentElement(node);
    openSidebar();
  }, [node, setCurrentElement, openSidebar]);

  const toggleOpen = useCallback((e: JSX.TargetedMouseEvent<HTMLDivElement>) => {
    if (!hasChildren) return;
    e.stopPropagation();
    setIsOpen(open => !open);
  }, [hasChildren]);

  const handleMouseEnter = useCallback(() => {
    client.highlightElement(node);
  }, [node, client]);

  const handleMouseLeave = useCallback(() => {
    client.clearHighlight();
  }, [client]);

  return (
    <div className="font-mono text-[11px] leading-tight select-none whitespace-nowrap w-fit min-w-full">
      {/* Node Tag Line */}
      <div 
        onClick={handleSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`group flex items-center py-0.5 px-1 transition-colors duration-0 cursor-default
          ${isSelected 
            ? 'bg-[#dbeefd] dark:bg-[#333940] !text-black dark:!text-white' 
            : 'hover:bg-[#f0f0f0] dark:hover:bg-[#35363a]'}`}
        style={{ paddingLeft: `${(depth * 14) + 4}px` }}
      >
        {/* Minimalist expand triangle arrow */}
        {hasChildren ? (
          <svg 
            onClick={toggleOpen}
            className={`w-2.5 h-2.5 text-gray-500 mr-0.5 transition-transform duration-75 transform ${isOpen ? 'rotate-90' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <div className="w-3" /> // Alignment spacer
        )}

        {/* Tag Name */}
        <span className="text-[#881280] dark:text-[#5db0d7]">
          &lt;<span className="">{tagLower}</span>
        </span>

        {/* Attributes in tree view */}
        {node.attributes && Object.entries(node.attributes).map(([key, value]) => (
          <span key={key} className="ml-1.5">
            <span className="text-[#994500] dark:text-[#9bbbdc]">{key}</span>
            <span className="text-black dark:text-white">=</span>
            <span className="text-[#1a1aa6] dark:text-[#f28b82]">"{value}"</span>
          </span>
        ))}

        <span className="text-[#881280] dark:text-[#5db0d7]">&gt;</span>

        {/* Dynamic closing placeholder snippet when collapsed */}
        {!isOpen && hasChildren && (
          <span className="text-gray-500 text-[10px] px-0.5 mx-0.5 font-sans">
            ···
          </span>
        )}

        {/* Immediate Closing Tag for collapsed nodes or nodes without children */}
        {(!isOpen || !hasChildren) && (
          <span className="text-[#881280] dark:text-[#5db0d7]">
            &lt;/<span className="">{tagLower}</span>&gt;
          </span>
        )}
      </div>

      {/* Children Node Scope block */}
      {hasChildren && isOpen && (
        <>
          <div className="ml-[5px]">
            {node.children?.map((childNode, index) => (
              <HtmlNodeRenderer key={index} node={childNode} depth={depth + 1} />
            ))}
          </div>

          {/* Dedicated Outro Closing Tag for structural clarity */}
          <div 
            className="text-[#881280] dark:text-[#5db0d7] py-0.5 px-1"
            style={{ paddingLeft: `${(depth * 14) + 16}px` }}
          >
            &lt;/<span className="">{tagLower}</span>&gt;
          </div>
        </>
      )}
    </div>
  );
});
