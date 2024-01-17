import {inject, observer} from "mobx-react";
import {Circle, Group, Layer, Rect} from "react-konva";
import {mapProject, teamShapes} from "../../../utils/game.js";
import KonvaImage from "../../../components/KonvaImage.jsx";
import {alpha} from "@mui/material";

/**
 * @param {import('src/store/store.js').Store} store
 * @param {number} mapSize
 * @param {number} scaleBalance
 * @returns {JSX.Element}
 * @constructor
 */
function PlayerLayer({store, mapSize, scaleBalance}) {
    const playerLifeStates = store.playerLifeStates;
    const playerPositions = store.playerPositions;
    const playerNames = store.playerNames;
    const modelSize = mapSize * 0.007;
    const iconSize = Math.max(mapSize * 0.025 * scaleBalance, modelSize);
    return <Layer>
        {[0, 1].map(teamIdx =>
            [0, 1, 2, 3, 4].map(playerIdx => (
                playerLifeStates[teamIdx][playerIdx] &&
                <PlayerIcon key={`${teamIdx}-${playerIdx}`}
                            shape={teamShapes[teamIdx]}
                            name={playerNames[teamIdx][playerIdx]}
                            pos={mapProject(playerPositions[teamIdx][playerIdx], mapSize)}
                            size={iconSize}
                            selected={store.focusedTeam === teamIdx && store.focusedPlayer === playerIdx}/>
            ))
        )}
    </Layer>
}

export default inject('store')(observer(PlayerLayer))


function PlayerIcon({shape, selected, pos, name, size}) {
    const scale = 1.1;
    return <Group x={pos[0]} y={pos[1]}>
        {shape === 'rect' &&
            <Rect x={-size / 2 * scale} y={-size / 2 * scale}
                  width={size * scale} height={size * scale}
                  cornerRadius={size / 8}
                  fill={alpha('#fff', 0.5)}
                  stroke={'black'}
                  strokeWidth={selected ? size * 0.1 : size * 0.05}/>}
        {shape === 'circle' &&
            <Circle radius={size / 2 * scale}
                    fill={alpha('#fff', 0.5)}
                    stroke={'black'}
                    strokeWidth={selected ? size * 0.1 : size * 0.05}/>}
        <KonvaImage src={`./icons/${name}.webp`}
                    x={-size / 2} y={-size / 2}
                    w={size} h={size}/>
    </Group>
}
