import {
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {inject, observer} from "mobx-react";

function Settings({open, store, onClose}) {
    const {i18n} = useTranslation();

    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
            <div>
                <ToggleButtonGroup exclusive
                                   value={i18n.language}
                                   onChange={(_, v) => i18n.changeLanguage(v)}>
                    <ToggleButton value={'en'}>Eng</ToggleButton>
                    <ToggleButton value={'cn'}>中文</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div>
                <FormControlLabel label={'Dev Mode'}
                                  control={
                                      <Checkbox checked={store.devMode}
                                                onChange={(_, checked) => store.setDevMode(checked)}/>
                                  }/>
            </div>
        </DialogContent>
    </Dialog>
}

export default inject('store')(observer(Settings))