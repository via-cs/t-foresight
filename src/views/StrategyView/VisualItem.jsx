import {Button, ListItem, ListItemSecondaryAction, Typography} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {useCallback, useRef} from "react";
import useHover from "../../utils/useHover.js";

/**
 * @param {string} name
 * @param {'small' | 'large'} size
 * @param {boolean} selected
 * @param {Function} onSelect
 * @param {boolean} expanded
 * @param {string} expandLabel
 * @param {Function | undefined} onExpand
 * @param {JSX.Element} mapSlice
 * @param {number} prob
 * @returns {JSX.Element}
 * @constructor
 */

const sizes = {
    small: 130,
    large: 150,
}

function VisualItem({
                        name,
                        size,
                        shallow = false,
                        selected, onSelect,
                        expanded = false, expandLabel, onExpand,
                        mapSlice, prob
                    }) {
    const handleExpand = useCallback(e => {
        e.preventDefault();
        e.stopPropagation();
        onExpand && onExpand();
    }, [onExpand]);
    const buttonRef = useRef(null);
    const hover = useHover(buttonRef);
    const indent = (sizes["large"] - sizes[size]) / 2;
    const formatProb = `${(prob * 100).toFixed(2)}%`;
    const visualProb = `${(prob * 100 * 2).toFixed(2)}%`;

    return <ListItem button
                     selected={selected} onClick={onSelect}
                     sx={{
                         height: sizes[size],
                         paddingLeft: `${65 + indent}px`,
                         paddingRight: 1,
                         ...(shallow && {opacity: .5})
                     }}>
        <Title lift={onExpand}>{name}</Title>
        <MapSlice size={sizes[size]}>
            {mapSlice}
        </MapSlice>
        <RightArea>
            {formatProb}
            <Bar style={{width: visualProb}}>
                {formatProb}
            </Bar>
            <Max>50%</Max>
        </RightArea>
        {onExpand && <SecondaryAction>
            <Button edge={'end'} onClick={handleExpand}
                    ref={buttonRef}
                    sx={{width: 64, textTransform: 'none'}}>
                {expanded ? <ExpandLess/>
                    : hover ? <ExpandMore/>
                        : expandLabel}
            </Button>
        </SecondaryAction>}
    </ListItem>
}

const Title = styled(Typography, {shouldForwardProp: propName => propName !== 'lift'})
(({lift}) => ({
    position: 'absolute',
    left: 0,
    width: 65,
    textAlign: 'center',
    pointerEvents: 'none',
    ...(lift ? {
        transform: 'translateY(-16px)',
    } : {
        transform: 'translateX(15px)'
    })
}))
const SecondaryAction = styled(ListItemSecondaryAction)({
    left: 0,
    width: 65,
    textAlign: 'center',
    top: 'calc(50% + 16px)'
})
const MapSlice = styled('div', {shouldForwardProp: propName => propName !== 'size'})
(({theme, size}) => ({
    marginLeft: theme.spacing(1),
    width: size - parseInt(theme.spacing(2)),
    flex: '0 0 auto',
    height: size - parseInt(theme.spacing(2)),
    border: `1px solid ${theme.palette.divider}`,
}))
const RightArea = styled('div')(({theme}) => ({
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    marginLeft: theme.spacing(1),
    flex: 1,
    height: 30,
    lineHeight: '30px',
    paddingLeft: theme.spacing(1),
    overflow: 'hidden',
}))
const Max = styled('div')(({theme}) => ({
    position: 'absolute',
    top: 0,
    right: theme.spacing(1),
}))
const Bar = styled('div')(({theme}) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: '100%',
    overflow: 'hidden',
    paddingLeft: 'inherit',
}))

export default VisualItem;