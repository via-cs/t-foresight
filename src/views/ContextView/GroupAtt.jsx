import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Badge, Box, Typography} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import {selectionColor} from "../../utils/theme";
import {getHighestAtt, getHighestAttIndices} from "./contextSortFunctions";

function AttentionItem({store, colorLabel, onSelect, label, valueKey, value, attention, compAtt}) {

    let isComp = store.comparedPredictors.length !== 0;
    let isSelect = store.selectedPredictors.length !== 0;
    let selectWorker = store.selectedPredictors.length === 1;
    let compWorker = store.comparedPredictors.length === 1;
    let isInclude = false;
    let selectAttention = [];
    let compAttention = [];
    let top3select = [];
    let top3comp = [];
    let top3sk = [];
    let selectedKey = [];
    let curLabel = '';

    if (isSelect) {
        selectAttention = getHighestAtt(store.selectedPredictorsAsAStrategy);
        selectedKey = getHighestAttIndices(store.selectedPredictorsAsAStrategy);

        if (store.playerNames[0].includes(String(label)) || store.playerNames[1].includes(String(label))) {
            isInclude = true;
            for (let i = 0; i < store.playerNames.length; i++) {
                for (let j = 0; j < store.playerNames[i].length; j++) {
                    if (store.playerNames[i][j] === String(label)) {
                        curLabel = 'p' + String(i) + String(j);
                    }
                }
            }
        } else if (String(label) === "Radiant") {
            isInclude = true;
            curLabel = 't0';
        } else if (String(label) === "Dire") {
            isInclude = true;
            curLabel = 't1';
        } else if (String(label) === "Environment") {
            isInclude = true;
            curLabel = 'g';
        }
        top3sk = selectedKey[curLabel];

        top3select = selectAttention[curLabel];
        if (isComp && top3sk) {
            compAttention = store.comparedPredictorsAsAStrategy.attention[curLabel];
            top3sk.forEach(k => {
                top3comp.push(compAttention[k].avg);
            });
            // console.log(top3comp);
            // console.log(top3select);
        }
    }

    // console.log(store.contextLimit);
    // console.log(colorLabel);
    // console.log(String(store.contextSort).slice(-8, -5));
    // console.log(value);
    // console.log(isInclude);
    // console.log(store.contextLimitDict);
    // console.log(label);


    return <div>
        <Container selectable={Boolean(onSelect)}
                   onClick={Boolean(onSelect) ? e => {
                       e.stopPropagation();
                       onSelect()
                   } : undefined}>
            <Box position={'absolute'} top={0} bottom={0} left={0} width={40}
                 display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <StyledBadge badgeContent={store.contextLimitDict[label]}
                             color={'primary'}>
                    {colorLabel}
                </StyledBadge>
            </Box>
            <Box marginLeft={'40px'} width={130} flex={'0 0 130px'}>
                <Typography sx={{height: 30, lineHeight: '30px'}} align={'center'} noWrap>{label} </Typography>
            </Box>

            <Box flex={1} position={'realtive'}>
                {!isComp && isInclude && top3select && <BarContainer>
                    <Tooltip open arrow placement={'left'} title={String(top3sk[0])}>
                        <Bar style={{
                            width: `${top3select[0] * 100 / 3}%`,
                            opacity: top3select[0],
                        }}/></Tooltip>
                    <Tooltip open arrow placement={'bottom'} title={String(top3sk[1])}>
                        <Bar style={{
                            width: `${top3select[1] * 100 / 3}%`,
                            opacity: top3select[1],
                        }}/></Tooltip>
                    <Tooltip open arrow placement={'right'} title={String(top3sk[2])}>
                        <Bar style={{
                            width: `${top3select[2] * 100 / 3}%`,
                            opacity: top3select[2],
                            borderRadius: '0 4px 4px 0'
                        }}/></Tooltip>
                </BarContainer>}

                {String(store.contextSort).slice(-8, -5) === 'iff' && isComp && isInclude && top3comp && top3select &&
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Tooltip open arrow placement={'bottom'} title={String(top3sk[0])}>
                            <BarContainer>
                                {top3select[0] >= top3comp[0] && <><Bar style={{
                                    width: `${(top3comp[0]) * 100}%`,
                                    height: 13,
                                    top: '5px',
                                    opacity: 0.8,
                                    borderRight: `2px solid ${selectionColor[1]}`,
                                    borderTop: `4px solid ${selectionColor[0]}`,
                                    borderBottom: `4px solid ${selectionColor[0]}`
                                }} barColor={selectionColor[1]}/>
                                    <Bar style={{
                                        width: `${(Math.max(top3select[0], top3comp[0]) - Math.min(top3select[0], top3comp[0])) * 100}%`,
                                        opacity: 0.8,
                                    }} barColor={selectionColor[0]}/> </>}
                                {!(top3select[0] >= top3comp[0]) && <><Bar style={{
                                    width: `${(top3select[0]) * 100}%`,
                                    height: 13,
                                    top: '5px',
                                    opacity: 0.8,
                                    borderRight: `2px solid ${selectionColor[1]}`,
                                    borderTop: `4px solid ${selectionColor[0]}`,
                                    borderBottom: `4px solid ${selectionColor[0]}`
                                }} barColor={selectionColor[1]}/>
                                    <Bar style={{
                                        width: `${(top3comp[0] - top3select[0]) * 100}%`,
                                        height: 13,
                                        top: '5px',
                                        opacity: 0.8,
                                        borderRight: `2px solid ${selectionColor[1]}`,
                                        borderTop: `4px solid white`,
                                        borderBottom: `4px solid white`,
                                    }} barColor={selectionColor[1]}/>
                                </>}
                            </BarContainer></Tooltip>
                        <Tooltip title={String(top3sk[1])}><BarContainer>
                            {top3select[1] >= top3comp[1] && <><Bar style={{
                                width: `${(top3comp[1]) * 100}%`,
                                height: 13,
                                top: '5px',
                                opacity: 0.8,
                                borderRight: `2px solid ${selectionColor[1]}`,
                                borderTop: `4px solid ${selectionColor[0]}`,
                                borderBottom: `4px solid ${selectionColor[0]}`
                            }} barColor={selectionColor[1]}/>
                                <Bar style={{
                                    width: `${(Math.max(top3select[1], top3comp[1]) - Math.min(top3select[1], top3comp[1])) * 100}%`,
                                    opacity: 0.8,
                                }} barColor={selectionColor[0]}/> </>}
                            {!(top3select[1] >= top3comp[1]) && <><Bar style={{
                                width: `${(top3select[0]) * 100}%`,
                                height: 13,
                                top: '5px',
                                opacity: 0.8,
                                borderRight: `2px solid ${selectionColor[1]}`,
                                borderTop: `4px solid ${selectionColor[0]}`,
                                borderBottom: `4px solid ${selectionColor[0]}`
                            }} barColor={selectionColor[1]}/>
                                <Bar style={{
                                    width: `${(top3comp[1] - top3select[1]) * 100}%`,
                                    height: 13,
                                    top: '5px',
                                    opacity: 0.8,
                                    borderRight: `2px solid ${selectionColor[1]}`,
                                    borderTop: `4px solid white`,
                                    borderBottom: `4px solid white`,
                                }} barColor={selectionColor[1]}/>
                            </>}
                        </BarContainer></Tooltip>
                        <Tooltip title={String(top3sk[2])}><BarContainer>
                            {top3select[2] >= top3comp[2] && <><Bar style={{
                                width: `${(top3comp[2]) * 100}%`,
                                height: 13,
                                top: '5px',
                                opacity: 0.8,
                                borderRight: `2px solid ${selectionColor[1]}`,
                                borderTop: `4px solid ${selectionColor[0]}`,
                                borderBottom: `4px solid ${selectionColor[0]}`
                            }} barColor={selectionColor[1]}/>
                                <Bar style={{
                                    width: `${(Math.max(top3select[2], top3comp[2]) - Math.min(top3select[2], top3comp[2])) * 100}%`,
                                    opacity: 0.8,
                                }} barColor={selectionColor[0]}/> </>}
                            {!(top3select[2] >= top3comp[2]) && <><Bar style={{
                                width: `${(top3select[2]) * 100}%`,
                                height: 13,
                                top: '5px',
                                opacity: 0.8,
                                borderRight: `2px solid ${selectionColor[1]}`,
                                borderTop: `4px solid ${selectionColor[0]}`,
                                borderBottom: `4px solid ${selectionColor[0]}`
                            }} barColor={selectionColor[1]}/>
                                <Bar style={{
                                    width: `${(top3comp[2] - top3select[2]) * 100}%`,
                                    height: 13,
                                    top: '5px',
                                    opacity: 0.8,
                                    borderRight: `2px solid ${selectionColor[1]}`,
                                    borderTop: `4px solid white`,
                                    borderBottom: `4px solid white`,
                                }} barColor={selectionColor[1]}/>
                            </>}
                        </BarContainer></Tooltip></div>}

                {String(store.contextSort).slice(-8, -5) === 'Att' && isComp && isInclude && top3comp && top3select &&
                    <div>
                        <BarContainer>
                            <Tooltip title={String(top3sk[0])}>
                                <Bar style={{
                                    width: `${top3select[0] * 100 / 3}%`,
                                    borderRight: `2px solid white`,

                                }}/></Tooltip>
                            <Tooltip title={String(top3sk[1])}>
                                <Bar style={{
                                    width: `${top3select[1] * 100 / 3}%`,
                                    borderRight: `2px solid white`,

                                }}/></Tooltip>
                            <Tooltip title={String(top3sk[2])}>
                                <Bar style={{
                                    width: `${top3select[2] * 100 / 3}%`,

                                    borderRadius: '0 4px 4px 0'
                                }}/></Tooltip>
                        </BarContainer>
                        <Bar2Container style={{top: "-11px"}}>
                            <Tooltip title={String(top3sk[0])}>
                                <Bar style={{
                                    width: `${top3comp[0] * 100 / 3}%`,
                                    borderRight: `2px solid white`,

                                }} barColor={selectionColor[1]}/></Tooltip>
                            <Tooltip title={String(top3sk[1])}>
                                <Bar style={{
                                    width: `${top3comp[1] * 100 / 3}%`,
                                    borderRight: `2px solid white`,
                                }} barColor={selectionColor[1]}/></Tooltip>
                            <Tooltip title={String(top3sk[2])}>
                                <Bar style={{
                                    width: `${top3comp[2] * 100 / 3}%`,
                                    borderRadius: '0 4px 4px 0'
                                }} barColor={selectionColor[1]}/></Tooltip>
                        </Bar2Container>
                    </div>
                }

            </Box>
        </Container>

    </div>
}

export default inject('store')(observer(AttentionItem));

const Container = styled('div', {
    shouldForwardProp: propName => !['selectable'].includes(propName)
})(({theme, selectable}) => ({
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    minHeight: 40,
    borderRadius: theme.shape.borderRadius,
    ...selectable && {
        '&:hover': {
            backgroundColor: theme.palette.background.paper
        }
    },
}))

const BarContainer = styled('div')(({theme}) => ({
    position: 'relative',
    height: 15,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    border: "1px solid grey"
}))

const Bar2Container = styled('div')(({theme}) => ({
    position: 'relative',
    display: 'flex',
    height: 6,
    width: '100%',
    backgroundColor: "transparent",
    borderRadius: theme.shape.borderRadius,
    flexWrap: 'nowrap',
    overflow: 'hidden',
    zIndex: 5
}))

const Bar = styled('div')(({theme, barColor}) => ({
    flex: '0 0 auto',
    height: '100%',
    backgroundColor: barColor || theme.palette.secondary.main,
    borderRight: `1px solid ${theme.palette.background.default}`,
}))

const StyledBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-badge': {
        right: 0,
        top: 0,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}))