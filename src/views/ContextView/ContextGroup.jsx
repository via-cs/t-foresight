import {styled} from "@mui/material/styles";
import {ButtonBase, Card, Collapse, darken, Divider, Paper} from "@mui/material";
import {useState} from "react";
import AttentionItem from "./AttentionItem.jsx";

function ContextGroup({colorLabel, groupName, informalGroup, attention = {}}) {
    const [open, setOpen] = useState(false);

    return <Container onClick={() => setOpen(s => !s)}>
        {!informalGroup && <AttentionItem colorLabel={colorLabel} label={groupName}/>}
        {!informalGroup && open && <Divider dir={'horizontal'} sx={{m: 0.5}}/>}
        <Collapse in={open || informalGroup}>
            {Object.keys(attention).map(key => (
                <AttentionItem key={key}
                               label={key}
                               value={attention[key]}/>
            ))}
        </Collapse>
    </Container>
}

const Container = styled(ButtonBase)(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    transition: 'all .3s ease',
    display: 'block',
    padding: theme.spacing(1),
    width: '100%',
    height: 'auto',
    '&:hover': {
        backgroundColor: darken(theme.palette.background.default, .02),
    },
    '& ~ &': {
        marginTop: theme.spacing(1),
    }
}))

export default ContextGroup;