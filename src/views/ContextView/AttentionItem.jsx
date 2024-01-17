import {inject, observer} from "mobx-react";
import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import {Check, Close} from "@mui/icons-material";

function AttentionItem({store, colorLabel, label, value, attention, curAtt}) {
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
                        selectAttention = topThreeAvgsPerPlayer['p'+i+j];
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
    <Container>
        <Box width={20} height={20} flex={'0 0 20px'} display={'flex'} alignItems={'center'}>{colorLabel}</Box>
        <Box width={150} flex={'0 0 150px'}><Typography sx={{maxWidth: 150}} align={'center'}
                                                        noWrap>{label}</Typography></Box>
        <Box width={100} flex={'0 0 120px'}>
            {isInclude && value === undefined && <Typography sx={{maxWidth: 150}} align={'center'} noWrap>{"Overall Attention"}</Typography>}
            {typeof value === 'number' && <Typography noWrap>{value.toFixed(0)}</Typography>}
            {typeof value === 'string' && <Typography noWrap>{value}</Typography>}
            {typeof value === 'boolean' && <Typography noWrap>{value ? <Check/> : <Close/>}</Typography>}
            {typeof value === 'object' &&
                <Typography noWrap>({parseInt(value[0] || 0)}, {parseInt(value[1] || 0)})</Typography>}
        </Box>
        <Box flex={1} position={'relative'}>
            {curAtt && <Anchor style={{left: `${curAtt * 100}%`}}/>}
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
    {selectAttention.length === 3 && <Container>
        <Box width={156} height={20} ></Box>
        <Box width={200} flex={'0 0 120px'}><Typography sx={{maxWidth: 150}} align={'center'}
                                                        noWrap>{'Worker\'s Attention'}</Typography></Box>
        <Box flex={1} position={'relative'}>
            {selectAttention && selectAttention.length && <BarContainer>
                <Bar style={{
                    width: `${selectAttention[0] * 100 / 3}%`,
                    opacity: (selectAttention[0])
                }}/>
                <Bar style={{
                    width: `${selectAttention[1] * 100 / 3}%`,
                    opacity: (selectAttention[1])
                }}/>
                <Bar style={{
                    width: `${selectAttention[2] * 100 / 3}%`,
                    opacity: (selectAttention[2]),
                    borderRadius: '0 4px 4px 0'
                }}/>
            </BarContainer>}
        </Box>
        </Container>}
    </div>
}

export default inject('store')(observer(AttentionItem));



const Container = styled('div', {
    shouldForwardProp: propName => !['withValue'].includes(propName)
})({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
}, ({withValue, theme}) => ({
    height: withValue ? 60 : 40,
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
