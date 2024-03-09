import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import {selectionColor} from "../../utils/theme";
import {getHighestAtt, getHighestAttIndices} from "./contextSortFunctions";
import ValueDisplay from "./ValueDisplay.jsx";

function ItemAtt({store, colorLabel, onSelect, label, valueKey, value, attention, compAtt}) {

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
                 display={'flex'} alignItems={'center'}
                 justifyContent={'center'}>
                {colorLabel}
            </Box>
            <Box margin={'0 0 10px 40px'} width={170} flex={'0 0 170px'}>
                <Typography sx={{height: 30, lineHeight: '30px'}} align={'center'} noWrap>{label}</Typography>
                <ValueDisplay valueKey={valueKey} value={value}/>
            </Box>

            <Box flex={1} position={'realtive'}>
                {!isComp && compWorker && compAtt && compAtt.avg && !compAtt?.length &&
                    <Anchor style={{left: `${comp.avg * 100}%`}}/>}
                {!isComp && compWorker && compAtt && compAtt.avg && !compAtt?.length &&
                    <Slider min={0}
                            max={1}/>}
                {!isComp && !compWorker && compAtt && compAtt.avg && !compAtt?.length &&
                    <Slider min={0} max={1}
                            style={{top: "5px"}}
                            value={[compAtt.min, compAtt.max]}
                            valueLabelDisplay={'auto'}
                            marks={[{
                                value: compAtt.avg,
                                label: `avg: ${compAtt.avg.toFixed(2)}`
                            }]}
                            valueLabelFormat={v => v.toFixed(2)}/>}

                {!isComp && selectWorker && attention && attention.avg && !attention?.length &&
                    <Anchor style={{left: `${attention.avg * 100}%`, top: "5px"}}/>}
                {!isComp && selectWorker && attention && attention.avg && !attention?.length &&
                    <Slider style={{top: "-20px"}}
                            min={0}
                            max={1}/>}
                {!isComp && !selectWorker && attention && attention.avg && !attention?.length &&
                    <Slider min={0} max={1}
                            style={{top: "5px"}}
                            value={[attention.min, attention.max]}
                            valueLabelDisplay={'auto'}
                            marks={[{
                                value: attention.avg,
                                label: `avg: ${attention.avg.toFixed(2)}`
                            }]}
                            valueLabelFormat={v => v.toFixed(2)}/>}

                {isComp && selectWorker && attention && attention.avg && !attention?.length &&
                    <Anchor style={{left: `${attention.avg * 100}%`, top: compWorker ? "20px" : "17px"}}
                            anchorColor={selectionColor[0]}/>}
                {isComp && compWorker && attention && attention.avg && compAtt && compAtt.avg && !attention?.length &&
                    <Anchor style={{left: `${compAtt.avg * 100}%`, top: selectWorker ? "-5px" : "17px"}}
                            anchorColor={selectionColor[1]}/>}
                {isComp && compWorker && attention && attention.avg && compAtt && compAtt.avg && selectWorker && !attention?.length &&
                    <Slider style={{top: "-30px"}}
                            min={0}
                            max={1}/>}
                {isComp && !selectWorker && compWorker && attention && attention.avg &&
                    <Slider min={0} max={1} style={{top: "-8px"}}
                            value={[attention.min, attention.max]}
                            valueLabelDisplay={'auto'}
                            marks={[{
                                value: attention.avg,
                                label: `avg: ${attention.avg.toFixed(2)}`
                            }]}
                            valueLabelFormat={v => v.toFixed(2)}
                            sliderColor={selectionColor[0]}/>}
                {isComp && !compWorker && selectWorker && compAtt && compAtt.avg &&
                    <Slider min={0} max={1} style={{top: "-8px"}}
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
                        style={{top: "30px", marginBottom: 20}}
                        min={0}
                        max={1}
                        value={[attention.min, attention.max]}
                        valueLabelDisplay="auto"
                        marks={[
                            {
                                value: attention.avg,
                                label: `avg: ${attention.avg.toFixed(2)}`
                            }
                        ]}
                        valueLabelFormat={v => v.toFixed(2)}
                        sliderColor={selectionColor[0]}
                    />
                    <ComparedRange
                        style={{top: "-24.5px", marginBottom: 0}}
                        min={0}
                        max={1}
                        value={[compAtt.min, compAtt.max]}
                        valueLabelDisplay="auto"
                        marks={[
                            {
                                value: compAtt.avg,
                                label: `comp-avg: ${compAtt.avg.toFixed(2)}`
                            }
                        ]}
                        valueLabelFormat={v => v.toFixed(2)}
                        sliderColor={selectionColor[1]}
                    />
                </>)}
            </Box>
        </Container>
    </div>
}

export default inject('store')(observer(ItemAtt));

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
    zIndex: 2,
    opacity: 0.8,

    '& .MuiSlider-track': {
        height: 15,
        border: 'none',
        borderRadius: 5,
    },
    '& .MuiSlider-thumb': {
        width: 4,
        height: 4,
        shadow: `0 0 4px 4px white`,
    },
    '& .MuiSlider-rail': {
        height: 15,
        backgroundColor: 'grey',
        borderRadius: 5,
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
    zIndex: 2,
    opacity: 0.8,

    '& .MuiSlider-track': {
        height: 6,
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
        borderRadius: 2,
    },
    '& .MuiSlider-mark': {
        backgroundColor: sliderColor || theme.palette.primary.main,
        height: 20,
        width: 2,
        zIndex: 4,
    },
    '& .MuiSlider-markLabel': {
        top: '-20px',
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
