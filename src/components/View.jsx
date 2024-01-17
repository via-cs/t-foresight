import {styled} from "@mui/material/styles";
import {viewSize} from "../utils/layout.js";
import {darken, lighten} from "@mui/material";

/**
 *
 * @param {string} title
 * @param {ReactNode[]} tools
 * @param {ReactNode} children
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @returns {JSX.Element}
 */

export default function View({
                                 title,
                                 tools,
                                 children,
                                 x, y, w, h
                             }) {
    return <Root style={{left: x, top: y, width: w, height: h}}>
        <TitleBar>
            <Title>{title}</Title>
            <Toolbar>
                {tools && tools.map((tool, tId) => <Tool key={tId}>
                    {tool}
                </Tool>)}
            </Toolbar>
        </TitleBar>
        <Content>
            {children}
        </Content>
    </Root>
}

const Root = styled('div')(({theme}) => ({
    position: "absolute",
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
}))

const TitleBar = styled('div')(({theme}) => ({
    height: viewSize.viewTitleBarHeight,
    background: lighten(theme.palette.background.default, 0.7),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}))

const Title = styled('h5')(({theme}) => ({
    padding: theme.spacing(0, 1),
    background: darken(theme.palette.background.default, 0.05),
    color: theme.palette.getContrastText(darken(theme.palette.background.default, 0.05)),
    height: viewSize.viewTitleBarHeight,
    lineHeight: `${viewSize.viewTitleBarHeight}px`,
    fontSize: `${viewSize.viewTitleBarHeight * 0.6}px`,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
}));

const Toolbar = styled('div')(({theme}) => ({
    display: 'flex',
    padding: theme.spacing(1),
    height: viewSize.viewTitleBarHeight,
    flexWrap: 'nowrap',
    overflow: 'auto hidden',
    alignItems: 'center',
}));

const Tool = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
}));

const Content = styled('div')(({theme}) => ({
    padding: theme.spacing(1),
    height: `calc(100% - ${viewSize.viewTitleBarHeight}px)`,
    overflow: 'hidden',
}));
