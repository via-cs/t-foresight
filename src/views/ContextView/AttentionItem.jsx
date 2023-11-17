import {styled} from "@mui/material/styles";
import {Box, Typography} from "@mui/material";

function AttentionItem({colorLabel, label, value, attention}) {
    return <Container>
        <Box width={20}>{colorLabel}</Box>
        <Typography width={150} noWrap>{label}</Typography>
        <Typography width={100}>{value}</Typography>
    </Container>
}

export default AttentionItem;

const Container = styled('div')(({theme}) => ({
    display: 'flex',
    height: 40,
    width: '100%',
    alignItems: 'center',
}))