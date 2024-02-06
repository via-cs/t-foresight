import {useCallback, useEffect, useRef, useState} from "react";
import {forceCollide, forceSimulation} from "d3";

/**
 *
 * @param {[number, number, number][]} ps
 * @param {number[][]} pg
 * @return {{points: [number, number][], onInit: () => void}}
 */
export default function useProjLayout(ps, pg) {
    const rScale = 20;
    const [points, setPoints] = useState([]);
    const [moving, setMoving] = useState(false);
    const nodesRef = useRef([]);

    //region layout change
    const onLayout = useCallback(() => {
        const nodes = nodesRef.current;
        const collide = forceCollide().radius(d => d.r).iterations(3);
        return forceSimulation(nodes)
            .alphaMin(0.9)
            .force('collide', collide)
            .on('tick', () => setPoints(nodes.map(n => [n.x, n.y, n.r * rScale])))
            .on('end', () => setMoving(false));
    }, []);

    useEffect(() => {
        if (moving) {
            const simulation = onLayout();
            return () => simulation.stop();
        }
    }, [moving]);
    //endregion

    //region data processing
    const onInit = useCallback(() => {
        nodesRef.current = [];
        const nodes = nodesRef.current;
        for (const [gid, g] of pg.entries())
            for (const pid of g) {
                const p = ps[pid];
                nodes.push({
                    x: p[0],
                    y: p[1],
                    r: p[2] / rScale,
                    group: gid,
                    id: pid,
                });
            }
        nodes.sort((a, b) => a.id - b.id);
        setPoints(nodes.map(n => [n.x, n.y, n.r * rScale]))
        setMoving(true);
    }, [ps]);

    useEffect(() => onInit(), [ps]);
    //endregion

    return {
        points: points.length !== ps.length ? ps : points,
        onInit,
    };
}