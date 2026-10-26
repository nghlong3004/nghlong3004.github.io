const semantic = new Set(['HEADER', 'SECTION', 'FOOTER'])

export function collectCompositionGroups(root: HTMLElement): HTMLElement[] {
    const groups: HTMLElement[] = []
    const visit = (element: HTMLElement, isRoot = false) => {
        const children = Array.from(element.children) as HTMLElement[]
        if (isRoot || (children.length > 1 && children.some(child => semantic.has(child.tagName)))) {
            children.forEach(child => visit(child))
        } else if (children.length === 1 && !semantic.has(element.tagName)) {
            visit(children[0])
        } else {
            groups.push(element)
        }
    }
    visit(root, true)
    return groups
}
