import {parseAsync} from "yieldable-json";

export function selectFile() {
    return new Promise((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = () =>
            resolve(fileInput.files[0]);
        fileInput.click();
    })
}

export function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            try {
                parseAsync(fileReader.result, (err, data) => {
                    if (!err) resolve(data);
                    else reject(err);
                })
            } catch (e) {
                reject(e);
            }
        }
        fileReader.readAsText(file);
    })
}
