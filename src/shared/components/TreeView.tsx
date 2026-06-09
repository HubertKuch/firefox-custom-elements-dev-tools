import { JSX } from 'preact';
import { VirtualHtmlNode } from '@types/node';
import { HtmlNodeRenderer } from '@components/HtmlNodeRenderer';

interface TreeViewProps {
  data: VirtualHtmlNode | null;
}

export function TreeView({ data }: TreeViewProps): JSX.Element {
  if (!data) return <div className="text-xs text-gray-400 p-4">Empty DOM Fragment</div>;

  return (
    <div className="flex-1 overflow-auto p-2 bg-white dark:bg-neutral-950">
      <HtmlNodeRenderer node={data} />
    </div>
  );
}
