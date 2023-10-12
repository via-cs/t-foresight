import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Tooltip, Typography} from "@mui/material";
import {playerColors, teamNames, teamShapes} from "../../utils/game.js";

/**
 * @param {0 | 1} team
 * @param {import('src/store/store.js').Store} store
 * @param {string[]} labels
 * @returns {JSX.Element}
 * @constructor
 */
function PlayerSelection({
                             team,
                             store,
                         }) {
    const playerLifeState = store.playerLifeStates[team];
    const players = store.playerNames[team];

    return <Root>
        <Typography sx={{mr: 1}}>{teamNames[team]}</Typography>
        {[0, 1, 2, 3, 4].map(playerIndex => (
            <Tooltip key={playerIndex}
                     title={players[playerIndex]}>
                <PlayerIcon shape={teamShapes[team]}
                            color={playerColors[team][playerIndex]}
                            lifeState={playerLifeState[playerIndex]}
                            selected={store.focusedTeam === team && store.focusedPlayer === playerIndex}
                            onClick={() => store.focusOnPlayer(team, playerIndex)}/>
            </Tooltip>
        ))}
    </Root>
}

export default inject('store')(observer(PlayerSelection))

const Root = styled('div')({
    display: 'flex',
    alignItems: 'center',
})

const PlayerIcon = styled('div')(({theme, shape, color, selected, lifeState}) => ({
    width: 20,
    height: 20,
    backgroundColor: color,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    borderRadius: shape === 'circle' ? '50%' : theme.shape.borderRadius,
    border: 'none',
    boxShadow: 'none',
    transition: 'border .3s ease; box-shadow .3s ease',
    ...(selected && {
        border: '3px solid black',
        boxShadow: '0 0 5px 0 rgba(0,0,0,.25)'
    }),
    ...(!lifeState && {
        opacity: 0.1,
    })
}))
