// Minimal, dependency-free reader for Payload's Lexical richText JSON.
//
// Payload's `ratgeber.body` field is `@payloadcms/richtext-lexical`, which
// stores a Lexical editor state tree (see Lexical's serialized node format:
// https://lexical.dev/docs/concepts/serialization). The frontend app
// (root package.json) has no richtext-lexical dependency — only `cms/`
// (the Payload backend) does — and the task explicitly says not to add a
// new heavy dependency just to render this. Lexical's JSON is a plain,
// well-documented tree, so this walks it directly: every top-level
// paragraph/heading block becomes one { text } entry, and inline text runs
// within a block are concatenated (bold/italic formatting is intentionally
// not preserved — no rich inline rendering elsewhere in this codebase to
// match, and guessing a markup scheme would be inventing presentation the
// CMS content doesn't ask for).
//
// This is a read path only: unknown/future Lexical node types degrade to
// "skip" rather than throwing, so an editor using a node type this walker
// doesn't know about doesn't take down the article page — it just omits
// that node's text.

type LexicalTextNode = {
  type: "text";
  text: string;
};

type LexicalElementNode = {
  type: string;
  children?: LexicalNode[];
};

type LexicalNode = LexicalTextNode | LexicalElementNode | Record<string, unknown>;

type LexicalRoot = {
  root?: {
    children?: LexicalNode[];
  };
};

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return (node as LexicalTextNode).type === "text" && typeof (node as LexicalTextNode).text === "string";
}

function collectText(node: LexicalNode): string {
  if (isTextNode(node)) return node.text;
  const children = (node as LexicalElementNode).children;
  if (Array.isArray(children)) {
    return children.map(collectText).join("");
  }
  return "";
}

const BLOCK_TYPES = new Set(["paragraph", "heading", "quote", "listitem"]);

/**
 * Flattens a Lexical richText document into an ordered list of block
 * paragraphs of plain text. Blank/whitespace-only blocks are dropped.
 * Returns [] for missing/malformed input rather than throwing — content
 * fetched over the network should never be able to crash a page render.
 */
export function lexicalToParagraphs(value: unknown): string[] {
  const root = (value as LexicalRoot | undefined)?.root;
  if (!root || !Array.isArray(root.children)) return [];

  const paragraphs: string[] = [];
  for (const block of root.children) {
    const type = (block as LexicalElementNode).type;
    // Render any block-level node with text-bearing children (paragraph,
    // heading, quote, list items, …) rather than an allowlist that could
    // silently drop content from a node type not anticipated here.
    if (!type) continue;
    const text = collectText(block).trim();
    if (text.length === 0) continue;
    if (BLOCK_TYPES.has(type) || Array.isArray((block as LexicalElementNode).children)) {
      paragraphs.push(text);
    }
  }
  return paragraphs;
}
