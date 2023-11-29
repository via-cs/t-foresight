import hull from 'hull.js'

export default function createConvexHull(points) {
    const samplePoints = points.map(([x, y, r]) => {
        return new Array(360).fill(0)
            .map((_, deg) => [
                x + r * Math.cos(deg / 180 * Math.PI) * 1.5,
                y + r * Math.sin(deg / 180 * Math.PI) * 1.5,
            ])
    }).flat()
    const hullPoints = hull(samplePoints, 1000);
    return 'M' + hullPoints.map(p => p.join(' ')).join('L')
}