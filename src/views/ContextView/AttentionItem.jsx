import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import {selectionColor} from "../../utils/theme";
import {getHighestAtt} from "./contextSortFunctions";
import ValueDisplay from "./ValueDisplay.jsx";

function AttentionItem({store, colorLabel, onSelect, label, valueKey, value, attention, compAtt}) {
    console.log(store.comparedPredictors)
    let isComp = store.comparedPredictors.length !== 0;
    let isSelect = store.selectedPredictors.length !== 0;
    let selectWorker = store.selectedPredictors.length === 1;
    let compWorker = store.comparedPredictors.length === 1;
    let isInclude = false;
    let selectAttention = [];
    let compAttention = [];
    let top3select = [];
    let top3comp = [];

    if (isSelect) {

        selectAttention = getHighestAtt(store.selectedPredictorsAsAStrategy);
        if (isComp) {
            compAttention = getHighestAtt(store.comparedPredictorsAsAStrategy);
        }

        if (store.playerNames[0].includes(String(label)) || store.playerNames[1].includes(String(label))) {
            isInclude = true;
            for (let i = 0; i < store.playerNames.length; i++) {
                for (let j = 0; j < store.playerNames[i].length; j++) {
                    if (store.playerNames[i][j] === String(label)) {
                        top3select = selectAttention['p' + i + j];
                        top3comp = isComp ? compAttention['p' + i + j] : [];
                    }
                }
            }
        } else if (String(label) === "Radiant") {
            isInclude = true;
            top3select = selectAttention['t0'];
            top3comp = isComp ? compAttention['t0'] : [];
        } else if (String(label) === "Dire") {
            isInclude = true;
            top3select = selectAttention['t1'];
            top3comp = isComp ? compAttention['t1'] : [];
        } else if (String(label) === "Environment") {
            isInclude = true;
            top3select = selectAttention['g'];
            top3comp = isComp ? compAttention['g'] : [];
        }
    }

    return <div>
        <Container selectable={Boolean(onSelect)}
                   onClick={Boolean(onSelect) ? e => {
                       e.stopPropagation();
                       onSelect()
                   } : undefined}>
            <Box position={'absolute'} top={0} bottom={0} left={0} width={20}
                 flex={'0 0 20px'} display={'flex'} alignItems={'center'}
                 justifyContent={'center'}>
                {colorLabel}
            </Box>
            <Box marginLeft={'20px'} width={160} flex={'0 0 160px'}>
                <Typography sx={{height: 30, lineHeight: '30px'}} align={'center'} noWrap>{label}</Typography>
                <ValueDisplay valueKey={valueKey} value={value}/>
            </Box>
            <Box flex={1} position={'realtive'}>
                {!isComp && selectWorker && !attention?.length &&
                    <Anchor style={{left: `${attention.avg * 100}%`, top: "33px"}}/>}
                {!isComp && selectWorker && !attention?.length && <Slider
                    min={0}
                    max={1}/>}
                {!isComp && !selectWorker && !attention?.length && <Slider min={0} max={1}
                                                                           style={{top: "20px"}}
                                                                           value={[attention.min, attention.max]}
                                                                           valueLabelDisplay={'auto'}
                                                                           marks={[{
                                                                               value: attention.avg,
                                                                               label: `avg: ${attention.avg.toFixed(2)}`
                                                                           }]}
                                                                           valueLabelFormat={v => v.toFixed(2)}/>}

                {isComp && selectWorker && !attention?.length &&
                    <Anchor style={{left: `${attention.avg * 100}%`, top: compWorker ? "33px" : "33px"}}
                            anchorColor={selectionColor[0]}/>}
                {isComp && compWorker && !attention?.length &&
                    <Anchor style={{left: `${compAtt.avg * 100}%`, top: selectWorker ? "8px" : "33px"}}
                            anchorColor={selectionColor[1]}/>}
                {isComp && compWorker && selectWorker && !attention?.length && <Slider
                    style={{top: "-25px"}}
                    min={0}
                    max={1}/>}
                {isComp && !selectWorker && compWorker && attention && attention.avg && <Slider min={0} max={1}
                                                                                                value={[attention.min, attention.max]}
                                                                                                valueLabelDisplay={'auto'}
                                                                                                marks={[{
                                                                                                    value: attention.avg,
                                                                                                    label: `avg: ${attention.avg.toFixed(2)}`
                                                                                                }]}
                                                                                                valueLabelFormat={v => v.toFixed(2)}
                                                                                                sliderColor={selectionColor[0]}/>}
                {isComp && !compWorker && selectWorker && compAtt && compAtt.avg && <Slider min={0} max={1}
                                                                                            value={[compAtt.min, compAtt.max]}
                                                                                            valueLabelDisplay={'auto'}
                                                                                            marks={[{
                                                                                                value: compAtt.avg,
                                                                                                label: `avg: ${compAtt.avg.toFixed(2)}`
                                                                                            }]}
                                                                                            valueLabelFormat={v => v.toFixed(2)}
                                                                                            sliderColor={selectionColor[1]}/>}
                {isComp && !compWorker && !selectWorker && attention && attention.avg && compAtt && compAtt.avg && (<>
                    <Slider
                        style={{top: "50px"}}
                        min={0}
                        max={1}
                        value={[attention.min, attention.max]}
                        valueLabelDisplay="auto"
                        marks={[
                            {
                                value: attention.avg,
                                label: `${attention.avg.toFixed(2)}`
                            }
                        ]}
                        valueLabelFormat={v => v.toFixed(2)}
                        sliderColor={selectionColor[0]}
                    /> </>)}
                {isComp && !compWorker && !selectWorker && attention && attention.avg && compAtt && compAtt.avg &&
                    <ComparedRange
                        style={{top: "-17.5px"}}
                        min={0}
                        max={1}
                        value={[compAtt.min, compAtt.max]}
                        valueLabelDisplay="auto"
                        marks={[
                            {
                                value: compAtt.avg,
                                label: `${compAtt.avg.toFixed(2)}`
                            }
                        ]}
                        valueLabelFormat={v => v.toFixed(2)}
                        sliderColor={selectionColor[1]}
                    />}

                {!isComp && isInclude && top3select && <BarContainer>
                    <Bar style={{
                        width: `${top3select[0] * 100 / 3}%`,
                        opacity: 0.8
                    }}/>
                    <Bar style={{
                        width: `${top3select[1] * 100 / 3}%`,
                        opacity: 0.8
                    }}/>
                    <Bar style={{
                        width: `${top3select[2] * 100 / 3}%`,
                        opacity: 0.8,
                        borderRadius: '0 4px 4px 0'
                    }}/>
                </BarContainer>}

                {isComp && isInclude && top3comp && top3select && <BarContainer>
                    <Bar style={{
                        width: `${Math.max(top3select[0], top3comp[0]) * 100 / 3}%`,
                        backgroundImage: `repeating-linear-gradient(
                            135deg, 
                            ${(top3select[0] > top3comp[0]) ? selectionColor[1] : selectionColor[0]}, 
                            ${(top3select[0] > top3comp[0]) ? selectionColor[1] : selectionColor[0]} 2px, 
                            ${(top3select[0] > top3comp[0]) ? selectionColor[0] : selectionColor[1]} 5px, 
                            ${(top3select[0] > top3comp[0]) ? selectionColor[0] : selectionColor[1]} 10px)`,
                        opacity: 0.8,
                        borderRight: `1px solid ${(top3select[0] > top3comp[0]) ? selectionColor[1] : selectionColor[0]}`
                    }} barColor='transparent'/>
                    <Bar style={{
                        width: `${(Math.max(top3select[0], top3comp[0]) - Math.min(top3select[0], top3comp[0])) * 100 / 3}%`,
                        opacity: 0.8,
                        borderRight: `2px solid white`
                    }} barColor={(top3select[0] > top3comp[0]) ? selectionColor[0] : selectionColor[1]}/>

                    <Bar style={{
                        width: `${Math.max(top3select[1], top3comp[1]) * 100 / 3}%`,
                        backgroundImage: `repeating-linear-gradient(
                            135deg, 
                            ${(top3select[1] > top3comp[1]) ? selectionColor[1] : selectionColor[0]}, 
                            ${(top3select[1] > top3comp[1]) ? selectionColor[1] : selectionColor[0]} 2px, 
                            ${(top3select[1] > top3comp[1]) ? selectionColor[0] : selectionColor[1]} 5px, 
                            ${(top3select[1] > top3comp[1]) ? selectionColor[0] : selectionColor[1]} 10px)`,
                        opacity: 0.8,
                        borderRight: `1px solid ${(top3select[1] > top3comp[1]) ? selectionColor[1] : selectionColor[0]}`
                    }} barColor='transparent'/>
                    <Bar style={{
                        width: `${(Math.max(top3select[1], top3comp[1]) - Math.min(top3select[1], top3comp[1])) * 100 / 3}%`,
                        opacity: 0.8,
                        borderRight: `2px solid white`
                    }} barColor={(top3select[1] > top3comp[1]) ? selectionColor[0] : selectionColor[1]}/>

                    <Bar style={{
                        width: `${Math.max(top3select[2], top3comp[2]) * 100 / 3}%`,
                        backgroundImage: `repeating-linear-gradient(
                            135deg, 
                            ${(top3select[2] > top3comp[2]) ? selectionColor[1] : selectionColor[0]}, 
                            ${(top3select[2] > top3comp[2]) ? selectionColor[1] : selectionColor[0]} 2px, 
                            ${(top3select[2] > top3comp[2]) ? selectionColor[0] : selectionColor[1]} 5px, 
                            ${(top3select[2] > top3comp[2]) ? selectionColor[0] : selectionColor[1]} 10px)`,
                        opacity: 0.8,
                        borderRight: `1px solid ${(top3select[2] > top3comp[2]) ? selectionColor[1] : selectionColor[0]}`
                    }} barColor='transparent'/>

                    <Bar style={{
                        width: `${(Math.max(top3select[2], top3comp[2]) - Math.min(top3select[2], top3comp[2])) * 100 / 3}%`,
                        opacity: 0.8,
                        borderRadius: '0 4px 4px 0'
                    }} barColor={(top3select[2] > top3comp[2]) ? selectionColor[0] : selectionColor[1]}/>
                </BarContainer>}
            </Box>
        </Container>
        <Box width={65} height={10}></Box>
        {isInclude && <Box width={300} height={20} flex={'0 0 250px'} display={'flex'} alignItems={'center'}>
            {/* <Box width={65} height={20} ></Box> */}
            <Bar style={{width: `${65}%`, height: `${10}`, borderTop: `1px solid grey`, borderRight: `1px solid grey`}}
                 barColor="transparent"> Feature </Bar>
            <Bar style={{width: `${220}%`, height: `${10}`, borderTop: `1px solid grey`}}
                 barColor="transparent"> Attention </Bar>
        </Box>}
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

const Slider = styled(MuiSlider)(({theme, sliderColor}) => ({
    color: sliderColor || theme.palette.primary.main,
    height: 15,
    zIndex: 2,
    opacity: 0.8,

    '& .MuiSlider-track': {
        border: 'none',
        borderRadius: 5,
    },
    '& .MuiSlider-thumb': {
        width: 4,
        height: 4,
        shadow: `0 0 4px 4px white`,
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'grey',
        borderRadius: 0,
    },
    '& .MuiSlider-mark': {
        backgroundColor: sliderColor || theme.palette.background.paper,
        height: 20,
        width: 2,
    },
    '& .MuiSlider-markLabel': {
        color: sliderColor || theme.palette.background.main, // Change the text color of the value label here
    }

}));

const ComparedRange = styled(MuiSlider)(({theme, sliderColor}) => ({
    color: sliderColor || theme.palette.primary.main,
    height: 15,
    zIndex: 2,
    opacity: 0.8,

    '& .MuiSlider-track': {
        border: 'none',
        borderRadius: 5,
    },
    '& .MuiSlider-thumb': {
        width: 4,
        height: 4,
        shadow: `0 0 4px 4px white`,
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'transparent',
        borderRadius: 0,
    },
    '& .MuiSlider-mark': {
        backgroundColor: sliderColor || theme.palette.primary.main,
        height: 20,
        width: 2,
        zIndex: 4,
    },
    '& .MuiSlider-markLabel': {
        color: sliderColor || theme.palette.background.paper, // Change the text color of the value label here
    }

}));

const Anchor = styled('div')(({theme, anchorColor, mark}) => ({
    position: 'relative',
    transition: 'left .3s ease',
    transform: 'translateX(-50%)',
    top: '12%',
    zIndex: 2,
    borderTop: `6px solid ${anchorColor || theme.palette.secondary.main}`,
    borderBottom: `6px solid ${anchorColor || theme.palette.secondary.main}`,
    borderLeft: `3px solid white`,
    borderRight: `3px solid white`,
    width: '10px',
    height: '25px',
    backgroundColor: anchorColor || theme.palette.secondary.main,
}));


const BarContainer = styled('div')(({theme}) => ({
    position: 'relative',
    height: 15,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexWrap: 'nowrap',
    overflow: 'hidden',
}))

const Bar = styled('div')(({theme, barColor}) => ({
    flex: '0 0 auto',
    height: '100%',
    backgroundColor: barColor || theme.palette.secondary.main,
    borderRight: `1px solid ${theme.palette.background.default}`,
}))
