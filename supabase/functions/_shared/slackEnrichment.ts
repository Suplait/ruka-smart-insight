import { buildLeadVisibilityBlocks, type LeadVisibility, type SlackBlock } from "./leadVisibility.ts";

type InitialMessage = { text: string; blocks: SlackBlock[] };

/** Update an existing message only; the saved contact blocks survive enrichment. */
export function slackEnrichmentMessage(initial: InitialMessage, channel: string, ts: string, revision: number, visibility: LeadVisibility) {
  const blocks = initial.blocks.filter(block => !block.block_id?.startsWith("ruka_visibility_"));
  // Updating a root must not notify the channel again. The new blocks never contain mentions.
  const safeBlocks = JSON.parse(JSON.stringify(blocks).replace(/<!(?:channel|here|everyone)>/g, "")) as SlackBlock[];
  return {
    channel, ts, text: initial.text.replace(/<!(?:channel|here|everyone)>/g, ""),
    parse: "none", link_names: false,
    blocks: [...safeBlocks, ...buildLeadVisibilityBlocks(visibility).map(block => ({ ...block, block_id: `${block.block_id}_${revision}` }))],
  };
}
