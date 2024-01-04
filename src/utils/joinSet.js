export default function joinSet(sets) {
    return sets.reduce((p, c) => new Set(Array.from(p).filter(v => c.has(v))), sets[0])
}