import {inject, observer} from "mobx-react";
import ContextGroup from "./ContextGroup.jsx";
import {styled} from "@mui/material/styles";
import {playerColors, teamNames, teamShapes} from "../../utils/game.js";
import {contextFactory} from "../../utils/fakeData.js";
import {Box} from "@mui/material";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function ContextView({store}) {
    const strat = store.selectedPredictorsAsAStrategy;
    const attention = strat ? strat.attention : contextFactory(() => ({}));
    const pred = store.predictions[store.viewedPrediction];
    const predAtt = pred ? pred.attention : contextFactory(() => undefined);

    return <Box width={'100%'} height={'100%'} overflow={'hidden auto'}>
        {[0, 1].map(teamId => [0, 1, 2, 3, 4].map(playerId => (
            <ContextGroup key={`${teamId}${playerId}`}
                          colorLabel={<PlayerIcon shape={teamShapes[teamId]}
                                                  color={playerColors[teamId][playerId]}
                                                  lifeState={store.playerLifeStates[teamId][playerId]}
                                                  selected={store.focusedTeam === teamId && store.focusedPlayer === playerId}/>}
                          groupName={store.playerNames[teamId][playerId] || `${teamNames[teamId]} Pos ${playerId + 1}`}
                          context={store.curContext[`p${teamId}${playerId}`]}
                          attention={attention[`p${teamId}${playerId}`]}
                          curAtt={predAtt[`p${teamId}${playerId}`]} />
        )))}
        <ContextGroup informalGroup
                      context={store.curContext['g']}
                      attention={attention['g']}
                      curAtt={predAtt['g']}/>
    </Box>
}

export default inject('store')(observer(ContextView));

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