import {useMemo} from "react";

export default function useProjection(predictors) {
    return useMemo(() => predictors.map(() => [Math.random() * 0.8 + 0.1, Math.random() * 0.8 + 0.1]), [predictors]);
}