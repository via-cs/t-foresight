import {styled} from "@mui/material/styles";
import {Button, Checkbox, Collapse, darken, Divider} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import AttentionItem from "./AttentionItem.jsx";
import {inject, observer} from "mobx-react";
import {useTranslation} from "react-i18next";
import {KeyboardArrowDown} from "@mui/icons-material";

function useExpand(length, initDisplayCnt = 3, expandDisplayCnt = 3) {
    const [open, setOpen] = useState(false);
    const [displayCnt, setDisplayCnt] = useState(initDisplayCnt);
    const expand = useCallback(() => setDisplayCnt(c => Math.min(length, c + expandDisplayCnt)), []);
    const toggle = useCallback(() => setOpen(o => !o), []);
    useEffect(() => {
        if (open) setDisplayCnt(initDisplayCnt);
        else setDisplayCnt(initDisplayCnt);
    }, [open]);
    return {open, displayCnt, expand, toggle}
}

function calHeight(open, displayCnt, totalCnt) {
    if (!open) return 60;
    if (displayCnt === totalCnt) return 71 + displayCnt * 40;
    return displayCnt * 40 + 101.75;
}

function ContextGroup({store, colorLabel, groupName, context, attention, curAtt}) {
    const {open, displayCnt, expand, toggle} = useExpand(Object.keys(context).length);
    const {t} = useTranslation();
    const sortedContextKeys = Object.keys(context).sort((a, b) => attention[b]?.avg - attention[a]?.avg);

    return <Container disableRipple
                      onClick={toggle}
                      sx={{height: calHeight(open, displayCnt, Object.keys(context).length), mt: 1}}>
        <AttentionItem colorLabel={colorLabel}
                       label={groupName}
                       attention={sortedContextKeys.slice(0, 3).map(key => attention[key]?.avg)}/>
        {open && <Divider dir={'horizontal'} sx={{m: 0.5}}/>}
        <Collapse in={open}>
            {sortedContextKeys
                .slice(0, displayCnt)
                .map(key => (
                    <AttentionItem key={key}
                                   colorLabel={<Checkbox checked={store.hasContextLimit(groupName, key)}
                                                         onClick={e => e.stopPropagation()}
                                                         onChange={(e, checked) =>
                                                             checked
                                                                 ? store.addContextLimit(groupName, key)
                                                                 : store.rmContextLimit(groupName, key)}
                                                         sx={{p: 0}}/>}
                                   label={t(`Game.${key}`)}
                                   value={context[key]}
                                   attention={attention[key]}
                                   curAtt={curAtt[key]}/>
                ))}
            {displayCnt < Object.keys(context).length &&
                <Button startIcon={<KeyboardArrowDown/>}
                        onClick={e => {
                            e.stopPropagation();
                            expand();
                        }}>
                    {t('System.ContextView.More')}
                </Button>
            }
        </Collapse>
    </Container>
}

const Container = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    transition: 'all .3s ease',
    display: 'block',
    padding: theme.spacing(1),
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden',
    '&:hover': {
        backgroundColor: darken(theme.palette.background.default, .02),
    },
    '& ~ &': {
        marginTop: theme.spacing(1),
    }
}))

export default inject('store')(observer(ContextGroup));