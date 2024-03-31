export default function newArr(len, facOrVal) {
    if (typeof facOrVal === 'function') return new Array(len).fill(0).map((_, i) => facOrVal(i));
    else return new Array(len).fill(facOrVal);
}