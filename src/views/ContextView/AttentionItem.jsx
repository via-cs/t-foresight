import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import {Check, Close} from "@mui/icons-material";

function AttentionItem({colorLabel, label, value, attention, curAtt}) {
    return <Container withValue={typeof value !== 'undefined'}>
        <Box width={20} height={20} flex={'0 0 20px'} display={'flex'} alignItems={'center'}>{colorLabel}</Box>
        <Box width={150} flex={'0 0 150px'}>
            <Typography sx={{maxWidth: 150}} align={'center'}
                        noWrap>{label}</Typography>
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
                    // opacity: (attention[0] - 0.5) * 2
                }}/>
                <Bar style={{
                    width: `${attention[1] * 100 / 3}%`,
                    // opacity: (attention[1] - 0.5) * 2
                }}/>
                <Bar style={{
                    width: `${attention[2] * 100 / 3}%`,
                    // opacity: (attention[2] - 0.5) * 2,
                    borderRadius: '0 4px 4px 0'
                }}/>
            </BarContainer>}
        </Box>
    </Container>
}

export default AttentionItem;

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
        borderRadius: 0,
    },
    '& .MuiSlider-thumb': {
        width: 4,
        height: 4,
        shadow: `0 0 4px 4px ${theme.palette.background.paper}`,
    },
    '& .MuiSlider-rail': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
    },
    '& .MuiSlider-mark': {
        backgroundColor: theme.palette.background.paper,
        height: 30,
        width: 1,
    }
}))

const Anchor = styled('div')(({theme}) => ({
    position: 'absolute',
    width: 0,
    height: 21,
    transition: 'left .3s ease',
    transform: 'translateX(-50%)',
    top: 10,
    borderTop: `3px solid ${theme.palette.secondary.main}`,
    borderBottom: `3px solid ${theme.palette.secondary.main}`,
    borderLeft: `3px solid white`,
    borderRight: `3px solid white`,
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
}))

const Bar = styled('div')(({theme}) => ({
    flex: '0 0 auto',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRight: `1px solid ${theme.palette.background.default}`,
}))
