import type { ContentBlock } from '../types'

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return blocks.map((block, index) => block.type === 'paragraph'
    ? <p key={index}>{block.text}</p>
    : <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>)
}
