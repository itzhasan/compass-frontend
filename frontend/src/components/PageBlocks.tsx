import { RichText } from "@/components/ui/RichText";
import type { Page } from "@/lib/api/types";

/** Renders a Page's flexible block-based body. Extend the switch as block types grow. */
export function PageBlocks({ blocks }: { blocks: Page["blocks"] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "richtext":
            return <RichText key={i} html={String(block.data.html ?? "")} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
