const semantic = new Set(['HEADER', 'SECTION', 'FOOTER'])

export function centerOutInsets(port: boolean, width: number, height: number, viewportHeight: number, inner: number, progress: number): string {
    if (!port) {
        const side = width * (1 - progress) / 2
        return `inset(0px ${side}px 0px ${side}px)`
    }
    const center = inner + viewportHeight / 2
    const half = viewportHeight * progress / 2
    return `inset(${Math.max(0, center - half)}px 0px ${Math.max(0, height - center - half)}px 0px)`
}

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
