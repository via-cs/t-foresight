import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import {selectionColor} from "../../utils/theme";
import {getHighestAtt, getHighestAttIndices} from "./contextSortFunctions";
import ValueDisplay from "./ValueDisplay.jsx";

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
    console.log(isInclude);
    console.log(store.contextLimitDict);
    console.log(label);
    
    


    return <div>
        <Container selectable={Boolean(onSelect)}
                   onClick={Boolean(onSelect) ? e => {
                       e.stopPropagation();
                       onSelect()
                   } : undefined}>
            <Box position={'absolute'} top={0} bottom={0} left={0} width={70}
                 flex={'0 0 70px'} display={'flex'} alignItems={'center'}
                 justifyContent={'center'}>
                {colorLabel} 
                {value === undefined && <Box width={20}/>}
            </Box>
            <Box position={'absolute'} top={0} bottom={0} left={0} width={30}
                 flex={'0 0 0px'} display={'flex'} alignItems={'bottom'}
                 justifyContent={'center'}>
                {value === undefined && isInclude && store.contextLimitDict[label] > 0 && <RedCircle size={`${15}px`} text={store.contextLimitDict[label]}/>} </Box>
            <Box marginLeft={'20px'} width={200} flex={'0 0 200px'}>
                <Typography sx={{height: 30, lineHeight: '30px'}} align={'center'} noWrap>{label} </Typography>
                <ValueDisplay valueKey={valueKey} value={value}/> 
            </Box>
            
            <Box flex={1} position={'realtive'}>
                {!isComp && compWorker  && compAtt && compAtt.avg && !compAtt?.length &&
                    <Anchor style={{left: `${comp.avg * 100}%`}}/>}
                {!isComp && compWorker  && compAtt && compAtt.avg && !compAtt?.length &&
                 <Slider
                    min={0}
                    max={1}/>}
                {!isComp && !compWorker  && compAtt && compAtt.avg && !compAtt?.length && <Slider min={0} max={1}
                                                                           style={{top: "5px"}}
                                                                           value={[compAtt.min, compAtt.max]}
                                                                           valueLabelDisplay={'auto'}
                                                                           marks={[{
                                                                               value: compAtt.avg,
                                                                               label: `avg: ${compAtt.avg.toFixed(2)}`
                                                                           }]}
                                                                           valueLabelFormat={v => v.toFixed(2)}/>}   

                {!isComp && selectWorker  && attention && attention.avg && !attention?.length &&
                    <Anchor style={{left: `${attention.avg * 100}%`, top: "5px"}}/>}
                {!isComp && selectWorker && attention && attention.avg && !attention?.length && <Slider
                style={{top: "-20px"}}
                    min={0}
                    max={1}/>}
                {!isComp && !selectWorker && attention && attention.avg && !attention?.length && <Slider min={0} max={1}
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
                {isComp && compWorker && attention && attention.avg && compAtt && compAtt.avg && selectWorker && !attention?.length && <Slider
                    style={{top: "-30px"}}
                    min={0}
                    max={1}/>}
                {isComp && !selectWorker && compWorker && attention && attention.avg && <Slider min={0} max={1} style={{top: "-8px"}}
                                                                                                value={[attention.min, attention.max]}
                                                                                                valueLabelDisplay={'auto'}
                                                                                                marks={[{
                                                                                                    value: attention.avg,
                                                                                                    label: `avg: ${attention.avg.toFixed(2)}`
                                                                                                }]}
                                                                                                valueLabelFormat={v => v.toFixed(2)}
                                                                                                sliderColor={selectionColor[0]}/>}
                {isComp && !compWorker && selectWorker && compAtt && compAtt.avg && <Slider min={0} max={1} style={{top: "-8px"}}
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
                        style={{top: "30px"}}
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
                        style={{top: "-24.5px"}}
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

                {!isComp && isInclude && top3select && <BarContainer>
                    <Tooltip title={String(top3sk[0])}>
                    <Bar style={{
                        width: `${top3select[0] * 100 / 3}%`,
                        opacity: top3select[0],
                    }}/></Tooltip>
                    <Tooltip title={String(top3sk[1])}>
                    <Bar style={{
                        width: `${top3select[1] * 100 / 3}%`,
                        opacity: top3select[1],
                    }}/></Tooltip>
                    <Tooltip title={String(top3sk[2])}>
                    <Bar style={{
                        width: `${top3select[2] * 100 / 3}%`,
                        opacity: top3select[2],
                        borderRadius: '0 4px 4px 0'
                    }}/></Tooltip>
                </BarContainer>}

                {String(store.contextSort).slice(-8, -5) === 'iff' && isComp && isInclude && top3comp && top3select && <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                <Tooltip title={String(top3sk[0])}>
                <BarContainer>  
                    {top3select[0]>=top3comp[0] && <><Bar style={{
                        width: `${(top3comp[0]) * 100}%`,
                        height:13,
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
                    {!(top3select[0]>=top3comp[0]) && <><Bar style={{
                        width: `${(top3select[0]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid ${selectionColor[0]}`,
                        borderBottom: `4px solid ${selectionColor[0]}`
                    }} barColor={selectionColor[1]}/>
                    <Bar style={{
                        width: `${(top3comp[0]-top3select[0]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid white`,
                        borderBottom: `4px solid white`,
                    }} barColor={selectionColor[1]}/>
                    </>}
                </BarContainer></Tooltip> 
                <Tooltip title={String(top3sk[1])}><BarContainer>
                {top3select[1]>=top3comp[1] && <><Bar style={{
                        width: `${(top3comp[1]) * 100}%`,
                        height:13,
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
                    {!(top3select[1]>=top3comp[1]) && <><Bar style={{
                        width: `${(top3select[0]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid ${selectionColor[0]}`,
                        borderBottom: `4px solid ${selectionColor[0]}`
                    }} barColor={selectionColor[1]}/>
                    <Bar style={{
                        width: `${(top3comp[1]-top3select[1]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid white`,
                        borderBottom: `4px solid white`,
                    }} barColor={selectionColor[1]}/>
                    </>}
                </BarContainer></Tooltip> 
                <Tooltip title={String(top3sk[2])}><BarContainer>
                {top3select[2]>=top3comp[2] && <><Bar style={{
                        width: `${(top3comp[2]) * 100}%`,
                        height:13,
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
                    {!(top3select[2]>=top3comp[2]) && <><Bar style={{
                        width: `${(top3select[2]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid ${selectionColor[0]}`,
                        borderBottom: `4px solid ${selectionColor[0]}`
                    }} barColor={selectionColor[1]}/>
                    <Bar style={{
                        width: `${(top3comp[2]-top3select[2]) * 100}%`,
                        height:13,
                        top: '5px',
                        opacity: 0.8,
                        borderRight: `2px solid ${selectionColor[1]}`,
                        borderTop: `4px solid white`,
                        borderBottom: `4px solid white`,
                    }} barColor={selectionColor[1]}/>
                    </>}
                </BarContainer></Tooltip> </div>}

                {String(store.contextSort).slice(-8, -5) === 'Att' && isComp && isInclude && top3comp && top3select && <div>
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
                <Bar2Container style={{top:"-11px"}}>
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
                    }}barColor={selectionColor[1]}/></Tooltip>
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
        top:'-20px',
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

function RedCircle({ size, text }) {
    const circleStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size, // size is a prop for width and height
      height: size,
      backgroundColor: selectionColor[0],
      borderRadius: '50%', // Makes the div a circle
      color: 'white', // Text color
      textAlign: 'center',
      lineHeight: size, // Vertically centers the text assuming single line of text
    };
  
    return (
      <div style={circleStyle}>
        {text}
      </div>
    );
  }