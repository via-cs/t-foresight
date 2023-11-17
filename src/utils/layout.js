import {useEffect, useLayoutEffect, useState} from "react";

export const viewSize = {
    timelineHeight: 100,
    appTitleBarHeight: 40,
    viewTitleBarHeight: 40,
    spacing: 10,
}

/**
 * @returns {{
 *  mapViewPos: {w: number, x: number, h: number, y: number},
 *  mapSize: number,
 *  strategyViewPos: {w: number, x: number, h: number, y: number},
 *  appTitleBarWidth: number,
 *  contextViewPos: {w: number, x: number, h: number, y: number}
 * }}
 */
export function useLayout() {
    const [layout, setLayout] = useState([1920, 1080]);
    useEffect(() => {
        const resize = () => {
            if (window.innerWidth !== layout[0] || window.innerHeight !== layout[1])
                setLayout([window.innerWidth, window.innerHeight]);
        }
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const mapSize = layout[1]
        - viewSize.spacing * 5
        - viewSize.appTitleBarHeight
        - viewSize.viewTitleBarHeight
        - viewSize.timelineHeight;
    const strategyViewWidth = layout[0] / 2 - mapSize / 2 - viewSize.spacing * 3;

    return {
        mapSize,
        appTitleBarWidth: mapSize + viewSize.spacing * 3,
        mapViewPos: {
            x: viewSize.spacing,
            y: viewSize.appTitleBarHeight + viewSize.spacing,
            w: mapSize + viewSize.spacing * 2,
            h: layout[1] - viewSize.appTitleBarHeight - viewSize.spacing * 2,
        },
        strategyViewPos: {
            x: mapSize + viewSize.spacing * 4,
            y: viewSize.spacing,
            w: strategyViewWidth,
            h: layout[1] - viewSize.spacing * 2,
        },
        contextViewPos: {
            x: mapSize + strategyViewWidth + viewSize.spacing * 5,
            y: viewSize.spacing,
            w: strategyViewWidth,
            h: layout[1] - viewSize.spacing * 2,
        },
    }
}
