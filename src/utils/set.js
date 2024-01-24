export function joinSet(sets) {
    return sets.reduce((p, c) => new Set(Array.from(p).filter(v => c.has(v))), sets[0])
}

export function unionSet(sets) {
    const res = new Set();
    for (const set of sets)
        for (const val of set.values())
            res.add(val);
    return res;
}