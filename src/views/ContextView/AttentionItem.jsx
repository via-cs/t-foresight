import {styled} from "@mui/material/styles";
import {Box, Slider as MuiSlider, Typography} from "@mui/material";
import {Check, Close} from "@mui/icons-material";

function AttentionItem({colorLabel, label, value, attention, curAtt}) {
    return <Container>
        <Box width={20} flex={'0 0 20px'}>{colorLabel}</Box>
        <Box width={150} flex={'0 0 150px'}><Typography noWrap>{label}</Typography></Box>
        <Box width={100} flex={'0 0 100px'}>
            {typeof value === 'number' && <Typography noWrap>{value.toFixed(0)}</Typography>}
            {typeof value === 'string' && <Typography noWrap>{value}</Typography>}
            {typeof value === 'boolean' && <Typography noWrap>{value ? <Check/> : <Close/>}</Typography>}
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
        </Box>
    </Container>
}

export default AttentionItem;

const Container = styled('div')({
    display: 'flex',
    height: 40,
    width: '100%',
    alignItems: 'center',
})

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
