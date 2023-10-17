import {inject, observer} from "mobx-react";
import {Circle, Layer, Rect} from "react-konva";
import {mapProject, playerColors, teamShapes} from "../../utils/game.js";

/**
 * @param {import('src/store/store').Store} store
 * @param {number} mapSize
 * @param {number} scaleBalance
 * @returns {JSX.Element}
 * @constructor
 */
function PlayerLayer({store, mapSize, scaleBalance}) {
    const playerLifeStates = store.playerLifeStates;
    const playerPositions = store.playerPositions;
    const modelSize = mapSize * 0.007;
    const iconSize = Math.max(mapSize * 0.02 * scaleBalance, modelSize);
    return <Layer>
        {[0, 1].map(teamIdx =>
            [0, 1, 2, 3, 4].map(playerIdx => (
                playerLifeStates[teamIdx][playerIdx] &&
                <PlayerIcon key={`${teamIdx}-${playerIdx}`}
                            teamIdx={teamIdx} playerIdx={playerIdx}
                            pos={mapProject(playerPositions[teamIdx][playerIdx], mapSize)}
                            size={iconSize}
                            selected={store.focusedTeam === teamIdx && store.focusedPlayer === playerIdx}/>
            ))
        )}
    </Layer>
}

export default inject('store')(observer(PlayerLayer))


function PlayerIcon({teamIdx, playerIdx, selected, pos, size}) {
    const style = {
        fill: playerColors[teamIdx][playerIdx],
        ...(selected && {
            stroke: 'black',
            strokeWidth: size * 0.1,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowOpacity: 1,
        })
    }
    if (teamShapes[teamIdx] === 'circle')
        return <Circle x={pos[0]} y={pos[1]}
                       radius={size / 2} shadow
                       {...style}/>
    else
        return <Rect x={pos[0] - size / 2} y={pos[1] - size / 2}
                     width={size} height={size}
                     {...style}/>
}
