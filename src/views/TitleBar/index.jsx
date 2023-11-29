/**
 *
 * @param {number} width
 * @constructor
 */
import {Button, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {viewSize} from "../../utils/layout.js";
import {inject, observer} from "mobx-react";
import {readJSONFile, selectFile} from "../../utils/file.js";
import {useTranslation} from "react-i18next";
import {Translate} from "@mui/icons-material";

/**
 * @param {number} width
 * @param {import('src/store/store').Store} store
 * @returns {JSX.Element}
 * @constructor
 */
function TitleBar({width, store}) {
    const {t, i18n} = useTranslation();
    const toggleLanguage = () => i18n.changeLanguage(
        i18n.language === 'en'
            ? 'cn'
            : 'en'
    );
    const handleImport = () => {
        selectFile()
            .then(file => {
                store.setWaiting(true);
                return readJSONFile(file);
            })
            .catch(err => window.alert(err))
            .then(data => store.setData(data.filename, data.data))
            .finally(() => store.setWaiting(false));
    }
    return <Bar style={{width}}>
        <Title variant={'h5'}>{t('System.SystemName')}</Title>
        <div>
            <Button variant={'contained'}
                    onClick={handleImport}>{t('System.Actions.import')}</Button>
            <Button variant={'contained'}
                    onClick={toggleLanguage}>
                <Translate fontSize={'small'}/>
            </Button>
        </div>
    </Bar>
}

export default inject('store')(observer(TitleBar));

const Bar = styled('div')(({theme}) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    height: viewSize.appTitleBarHeight,
    backgroundColor: theme.palette.primary.main,
    borderBottomRightRadius: theme.shape.borderRadius,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
}))

const Title = styled(Typography)(({theme}) => ({
    color: theme.palette.primary.contrastText,
}))
