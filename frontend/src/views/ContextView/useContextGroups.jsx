import {teamNames, teamShapes} from "../../utils/game.js";
import {styled} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {contextFactory} from "../../utils/fakeData.js";

export default function useContextGroups(store) {
    const {t} = useTranslation();
    const strat = store.selectedPredictorsAsAStrategy;
    const attention = strat ? strat.attention : contextFactory(store.curContext, () => ({}));
    const compStrat = store.comparedPredictorsAsAStrategy;
    const compAtt = compStrat ? compStrat.attention : contextFactory(store.curContext, () => ({}));
    const cgs = [];
    [0, 1].forEach(teamId => {
        cgs.push({
            key: `t${teamId}`,
            colorLabel: <LogoIcon src={`./icons/${teamNames[teamId]}.png`}
                                  shape={teamShapes[teamId]}/>,
            groupName: t(`Game.${teamNames[teamId]}`),
            context: store.curContext[`t${teamId}`],
            attention: attention[`t${teamId}`],
            compAtt: compAtt[`t${teamId}`],
        });
        [0, 1, 2, 3, 4].forEach(playerId => {
            cgs.push({
                key: `p${teamId}${playerId}`,
                colorLabel: <PlayerIcon src={`./icons/${store.playerNames[teamId][playerId] || 'hero'}.webp`}
                                        shape={teamShapes[teamId]}
                                        selected={store.focusedTeam === teamId && store.focusedPlayer === playerId}
                                        lifeState={store.playerLifeStates[teamId][playerId]}/>,
                groupName: store.playerNames[teamId][playerId] || t('Game.PlayerPos', {
                    team: t(`Game.${teamNames[teamId]}`),
                    playerId: playerId + 1,
                }),
                context: store.curContext[`p${teamId}${playerId}`],
                attention: attention[`p${teamId}${playerId}`],
                compAtt: compAtt[`p${teamId}${playerId}`],
            });
        })
    })
    cgs.push({
        key: 'g',
        colorLabel: <LogoIcon src={`./icons/Dota.png`}/>,
        groupName: t('System.ContextView.GameContext'),
        context: store.curContext['g'],
        attention: attention['g'],
        compAtt: compAtt['g'],
    });
    return cgs;
}

const PlayerIcon = styled('img', {
    shouldForwardProp: propName => !['shape', 'selected', 'lifeState'].includes(propName)
})(
    ({theme, shape, selected, lifeState}) => ({
        width: 20,
        height: 20,
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