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
import {Settings, Signpost, Translate} from "@mui/icons-material";

/**
 * @param {number} width
 * @param {import('src/store/store').Store} store
 * @returns {JSX.Element}
 * @constructor
 */
function TitleBar({width, store}) {
    const {t, i18n} = useTranslation();
    const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'en' ? 'cn' : 'en');
    const handleImportData = () => {
        selectFile()
            .then(file => {
                store.setWaiting(true);
                return readJSONFile(file);
            })
            .catch(window.alert)
            .then(data => store.setData(data.filename, data.data))
            .finally(() => store.setWaiting(false));
    }
    const handleImportCase = () => {
        selectFile()
            .then(file => {
                store.setWaiting(true);
                return readJSONFile(file);
            })
            .catch(window.alert)
            .then(data => {
                if (data.data.match_id !== store.gameData.gameInfo.match_id)
                    throw new Error("The case is not for this match!");
                store.setCase(data.data);
            })
            .catch(window.alert)
            .finally(() => store.setWaiting(false));
    }
    const handleSaveCase = () => store.saveCase();

    return <Bar style={{width}}>
        <Signpost color={"inherit"}/>
        <Typography variant={'h5'}>{t('System.SystemName')}</Typography>
        <div style={{flex: 1}}/>
        <Button variant={'contained'}
                sx={{mr: 1}}
                disabled={!store.gameData}
                onClick={handleImportCase}>{t('System.Actions.importCase')}</Button>
        <Button variant={'contained'}
                disabled={!store.gameData}
                sx={{mr: 1}}
                onClick={handleSaveCase}>{t('System.Actions.saveCase')}</Button>
        <Button variant={'contained'}
                sx={{mr: 1}}
                onClick={handleImportData}>{t('System.Actions.importData')}</Button>
        <Button variant={'contained'}
                sx={{mr: 1}}
                onClick={toggleLanguage}>
            <Translate fontSize={'small'}/>
        </Button>
        <Button variant={'contained'}
                color={store.devMode ? 'secondary' : 'primary'}
                sx={{mr: 1}}
                onClick={() => store.setDevMode(!store.devMode)}>
            <Settings/>
        </Button>
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
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}))
