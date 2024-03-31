export function probOpacity(prob) {
    if (prob >= 0.1) return 1;
    else if (prob >= 0.07) return 0.8;
    else if (prob >= 0.05) return 0.6;
    else if (prob >= 0.02) return 0.4;
    else if (prob > 0) return 0.2;
    else return 0;
}