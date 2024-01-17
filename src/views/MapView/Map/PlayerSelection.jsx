import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Tooltip, Typography} from "@mui/material";
import {playerColors, teamNames, teamShapes} from "../../../utils/game.js";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

    return <Root>
        <Typography sx={{mr: 1}}>{t(`Game.${teamNames[team]}`)}</Typography>
        {[0, 1, 2, 3, 4].map(playerIndex => (
            <Tooltip key={playerIndex}
                     title={players[playerIndex]}>
                <PlayerIcon shape={teamShapes[team]}
                            color={playerColors[team][playerIndex]}
                            src={`./icons/${players[playerIndex] || 'hero'}.webp`}
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

const PlayerIcon = styled('img')(
    ({theme, shape, selected, lifeState}) => ({
        width: 20,
        height: 20,
        marginRight: theme.spacing(1),
        cursor: 'pointer',
        borderRadius: shape === 'rect' ? theme.shape.borderRadius : 10,
        boxShadow: 'none',
        transition: 'border .3s ease; box-shadow .3s ease',
        border: '1px solid grey',
        ...(selected && {
            border: '2px solid black',
            boxShadow: '0 0 5px 0 rgba(0,0,0,.25)'
        }),
        ...(!lifeState && {
            opacity: 0.1,
        })
    }))
