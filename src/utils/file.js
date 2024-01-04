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
                    if (!err) resolve({filename: file.name, data});
                    else reject(err);
                })
            } catch (e) {
                reject(e);
            }
        }
        fileReader.readAsText(file);
    })
}

export function hashFileName(prefix, content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const chr = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return `${prefix}-${hash}`;
}
