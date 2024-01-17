import {inject, observer} from "mobx-react";
import ContextGroup from "./ContextGroup.jsx";
import {styled} from "@mui/material/styles";
import {teamNames, teamShapes} from "../../utils/game.js";
import {contextFactory} from "../../utils/fakeData.js";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Fragment} from "react";

/**
 *
 * @param {import('src/store/store.js').Store} store
 * @return {JSX.Element}
 * @constructor
 */
function ContextView({store}) {
    const strat = store.selectedPredictorsAsAStrategy;
    const playerNames = store.playerNames;
    const attention = strat ? strat.attention : contextFactory(store.curContext, () => ({}));
    const pred = store.predictions[store.viewedPrediction];
    const predAtt = pred ? pred.attention : contextFactory(store.curContext, () => undefined);
    const {t} = useTranslation();

    return <Box width={'100%'} height={'100%'} overflow={'hidden auto'}>
        {[0, 1].map(teamId => <Fragment key={teamId}>
            <ContextGroup colorLabel={<LogoIcon src={`./${teamNames[teamId]}.png`}
                                                shape={teamShapes[teamId]}/>}
                          groupName={t(`Game.${teamNames[teamId]}`)}
                          context={store.curContext[`t${teamId}`]}
                          attention={attention[`t${teamId}`]}
                          curAtt={predAtt[`t${teamId}`]}/>
            {[0, 1, 2, 3, 4].map(playerId => (
                <ContextGroup key={`${teamId}${playerId}`}
                              colorLabel={<PlayerIcon src={`./icons/${playerNames[teamId][playerId] || 'hero'}.webp`}
                                                      shape={teamShapes[teamId]}
                                                      selected={store.focusedTeam === teamId && store.focusedPlayer === playerId}
                                                      lifeState={store.playerLifeStates[teamId][playerId]}/>}
                              groupName={store.playerNames[teamId][playerId] || t('Game.PlayerPos', {
                                  team: t(`Game.${teamNames[teamId]}`),
                                  playerId: playerId + 1,
                              })}
                              context={store.curContext[`p${teamId}${playerId}`]}
                              attention={attention[`p${teamId}${playerId}`]}
                              curAtt={predAtt[`p${teamId}${playerId}`]}/>
            ))}
        </Fragment>)}
        <ContextGroup colorLabel={<LogoIcon src={`./Dota.png`}/>}
                      groupName={t('System.ContextView.GameContext')}
                      context={store.curContext['g']}
                      attention={attention['g']}
                      curAtt={predAtt['g']}/>
    </Box>
}

export default inject('store')(observer(ContextView));

const PlayerIcon = styled('img', {
    shouldForwardProp: propName => !['shape', 'selected', 'lifeState'].includes(propName)
})(
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

const LogoIcon = styled('img', {
    shouldForwardProp: propName => !['shape'].includes(propName)
})(({theme, shape}) => ({
    width: 20,
    height: 20,
    borderRadius: shape === 'rect' ? theme.shape.borderRadius : 10,
}))