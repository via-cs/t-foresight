import {MenuItem} from "@mui/material";
import {inject, observer} from "mobx-react";

function WorkerTagsMenu({store, tagSelection, onFinish}) {
    const handleAddTag = () => {
        onFinish();
        const tag = window.prompt('Input the tag name:');
        if (!tag) return;
        store.addTag(tagSelection.current, tag);
    }
    const handleRemoveTag = () => {
        onFinish();
        const tag = window.prompt('Input the tag name:');
        if (!tag) return;
        store.removeTag(tagSelection.current, tag);
    }
    const handleClearTag = () => {
        onFinish();
        store.clearTag(tagSelection.current)
    }
    return [
        <MenuItem key={'add'} onClick={handleAddTag}>Add Tag</MenuItem>,
        <MenuItem key={'rem'} onClick={handleRemoveTag}>Remove Tag</MenuItem>,
        <MenuItem key={'clr'} onClick={handleClearTag}>Clear Tag</MenuItem>,
    ]
}

export default inject('store')(observer(WorkerTagsMenu));