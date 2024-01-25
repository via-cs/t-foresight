import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import ValueDisplay from "./ValueDisplay.jsx";

function AttentionItem({store, colorLabel, onSelect, label, valueKey, value, attention, compAtt}) {
    let selectAttention = [];
    let isInclude = false;
    if (store.viewedPrediction !== -1) {
        const playerData = store.predictions[String(store.viewedPrediction)].attention;
        const topThreeAvgsPerPlayer = {};
        Object.keys(playerData).forEach(playerKey => {
            if (playerData[playerKey]) {
                const avgs = Object.values(playerData[playerKey])
                    .sort((a, b) => b - a); // 降序排序

                // 取排序后的前三个值
                topThreeAvgsPerPlayer[playerKey] = avgs.slice(0, 3);
            }
        });

        if (store.playerNames[0].includes(String(label)) || store.playerNames[1].includes(String(label))) {
            isInclude = true;
            for (let i = 0; i < store.playerNames.length; i++) {
                for (let j = 0; j < store.playerNames[i].length; j++) {
                    if (store.playerNames[i][j] === String(label)) {
                        selectAttention = topThreeAvgsPerPlayer['p' + i + j];
                    }
                }
            }
        } else if (String(label) === "Radiant") {
            isInclude = true;
            selectAttention = topThreeAvgsPerPlayer['t0'];
        } else if (String(label) === "Dire") {
            isInclude = true;
            selectAttention = topThreeAvgsPerPlayer['t1'];
        } else if (String(label) === "Environment") {
            isInclude = true;
            selectAttention = topThreeAvgsPerPlayer['g'];
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
            <Box flex={1} position={'relative'}>
                {compAtt && <Anchor style={{left: `${compAtt * 100}%`}}/>}
                {attention && attention.avg && <Slider min={0} max={1}
                                                       value={[attention.min, attention.max]}
                                                       valueLabelDisplay={'auto'}
                                                       marks={[{
                                                           value: attention.avg,
                                                           label: `avg: ${attention.avg.toFixed(2)}`
                                                       }]}
                                                       valueLabelFormat={v => v.toFixed(2)}/>}
                {attention && attention.length && <BarContainer>
                    <Bar style={{
                        width: `${attention[0] * 100 / 3}%`,
                        opacity: (attention[0])
                    }}/>
                    <Bar style={{
                        width: `${attention[1] * 100 / 3}%`,
                        opacity: (attention[1])
                    }}/>
                    <Bar style={{
                        width: `${attention[2] * 100 / 3}%`,
                        opacity: (attention[2]),
                        borderRadius: '0 4px 4px 0'
                    }}/>
                </BarContainer>}
            </Box>
        </Container>
        {/*{selectAttention.length === 3 && <Container>*/}
        {/*    <Box width={156} height={20}></Box>*/}
        {/*    <Box width={200} flex={'0 0 120px'}><Typography sx={{maxWidth: 150}} align={'center'}*/}
        {/*                                                    noWrap>{'Worker\'s Attention'}</Typography></Box>*/}
        {/*    <Box flex={1} position={'relative'}>*/}
        {/*        {selectAttention && selectAttention.length && <BarContainer>*/}
        {/*            <Bar style={{*/}
        {/*                width: `${selectAttention[0] * 100 / 3}%`,*/}
        {/*                opacity: (selectAttention[0])*/}
        {/*            }}/>*/}
        {/*            <Bar style={{*/}
        {/*                width: `${selectAttention[1] * 100 / 3}%`,*/}
        {/*                opacity: (selectAttention[1])*/}
        {/*            }}/>*/}
        {/*            <Bar style={{*/}
        {/*                width: `${selectAttention[2] * 100 / 3}%`,*/}
        {/*                opacity: (selectAttention[2]),*/}
        {/*                borderRadius: '0 4px 4px 0'*/}
        {/*            }}/>*/}
        {/*        </BarContainer>}*/}
        {/*    </Box>*/}
        {/*</Container>}*/}
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

const Slider = styled(MuiSlider)(({theme}) => ({
    color: theme.palette.primary.main,
    height: 15,
    '& .MuiSlider-track': {
        border: 'none',
        borderRadius: 5,
    },
    '& .MuiSlider-thumb': {
        width: 4,
        height: 4,
        shadow: `0 0 4px 4px ${theme.palette.background.paper}`,
    },
    '& .MuiSlider-rail': {
        backgroundColor: 'grey',
        borderRadius: 0,
    },
    '& .MuiSlider-mark': {
        backgroundColor: theme.palette.background.paper,
        height: 20,
        width: 2,
    }
}))


const Anchor = styled('div')(({theme}) => ({
    position: 'absolute',
    transition: 'left .3s ease',
    transform: 'translateX(-50%)',
    top: '12%',
    borderTop: `3px solid ${theme.palette.secondary.main}`,
    borderBottom: `3px solid ${theme.palette.secondary.main}`,
    borderLeft: `3px solid white`,
    borderRight: `3px solid white`,
    width: '10px', // 增加锚点的宽度
    height: '25px', // 增加锚点的高度
    backgroundColor: theme.palette.secondary.main, // 改变锚点的背景颜色以便更加突出
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

const Bar = styled('div')(({theme}) => ({
    flex: '0 0 auto',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRight: `1px solid ${theme.palette.background.default}`,
}))
