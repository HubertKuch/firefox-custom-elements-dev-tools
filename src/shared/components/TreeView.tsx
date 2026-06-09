import { JSX } from 'preact';
import { VirtualHtmlNode } from '@types/node';
import { HtmlNodeRenderer } from '@components/HtmlNodeRenderer';

interface TreeViewProps {
  data: VirtualHtmlNode | null;
}

export function TreeView({ data }: TreeViewProps): JSX.Element {
  if (!data) return <div className="text-[11px] text-gray-400 p-4 italic">No elements found.</div>;

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-[#202124]">
      <HtmlNodeRenderer node={data} />
    </div>
  );
}
