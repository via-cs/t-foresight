import {styled} from "@mui/material/styles";
import {Button, Divider, Box} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import AttentionItem from "./AttentionItem.jsx";
import {inject, observer} from "mobx-react";
import {useTranslation} from "react-i18next";
import {KeyboardArrowDown} from "@mui/icons-material";

function ContextGroup({store, colorLabel, groupName, context, attention, compAtt}) {
    //region content control
    const [open, setOpen] = useState(false);
    const [displayCnt, setDisplayCnt] = useState(0);
    const toggle = () => {
        setOpen(!open);
        setDisplayCnt(open ? 0 : 3);
    }
    const expand = () =>
        setDisplayCnt(Math.min(displayCnt + 3, Object.keys(context).length));
    //endregion

    //region height control
    const containerRef = useRef();
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const lastChild = container.lastChild;
        setHeight(lastChild.offsetTop + lastChild.clientHeight + parseInt(container.style.paddingBottom));
    }, [open, displayCnt]);
    //endregion

    const {t} = useTranslation();
    const sortedContextKeys = Object.keys(context).sort((a, b) => attention[b]?.avg - attention[a]?.avg);

    const handleToggleContextLimit = key => {
        if (store.hasContextLimit(groupName, key))
            store.rmContextLimit(groupName, key)
        else
            store.addContextLimit(groupName, key)
    }

    return <Container ref={containerRef}
                      disableRipple
                      onClick={toggle}
                      sx={{height, mt: 1}}>
        <AttentionItem colorLabel={colorLabel}
                       valueKey={null}
                       label={groupName}
                       attention={sortedContextKeys.slice(0, 3).map(key => attention[key]?.avg)}
                       compAtt={sortedContextKeys.slice(0, 3).map(key => attention[key]?.avg)}
        />
        {open && <Divider dir={'horizontal'} sx={{m: 0.5}}/>}
        {open && (
            <Box sx={{position: 'relative', my: 1}} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{width: '65%', height: '25px', border: '1px solid grey'}}>Feature</div>
                <div style={{width: '100%', height: '25px', border: '1px solid grey'}}>Attention</div>
            </Box>
            )}
        {sortedContextKeys
            .slice(0, displayCnt)
            .map(key => (
                <AttentionItem key={key}
                               onSelect={() => handleToggleContextLimit(key)}
                               colorLabel={
                                   <Button variant={store.hasContextLimit(groupName, key) ? 'contained' : 'outlined'}
                                           color={'primary'}
                                           sx={{
                                               width: 5,
                                               height: 'calc(100% - 20px)',
                                               padding: 0,
                                           }}/>
                               }
                               label={t(`Game.${key}`)}
                               valueKey={key}
                               value={context[key]}
                               attention={attention[key]}
                               compAtt={compAtt[key]}/>
            ))}
        {
            open && displayCnt < Object.keys(context).length &&
            <Button startIcon={<KeyboardArrowDown/>}
                    onClick={e => {
                        e.stopPropagation();
                        expand();
                    }}>
                {t('System.ContextView.More')}
            </Button> // show more
        }
    </Container>
}

const Container = styled('div')(({theme}) => ({
    position: 'relative',
    border: `1px solid ${theme.palette.background.default}`,
    borderRadius: theme.shape.borderRadius,
    transition: 'height .3s ease',
    display: 'block',
    padding: theme.spacing(1),
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.background.default,
    },
    '& ~ &': {
        marginTop: theme.spacing(1),
    }
}))

export default inject('store')(observer(ContextGroup));