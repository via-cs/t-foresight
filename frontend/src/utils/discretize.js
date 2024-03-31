export default function discretize(d, range, levels) {
    if (d < range[0] || d > range[1]) return -1;
    return Math.min(levels - 1, Math.floor((d - range[0]) / (range[1] - range[0]) * levels));
}