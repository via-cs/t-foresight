import {useMemo} from "react";
import {styled} from "@mui/material/styles";

function colorize(pixels, gradient) {
    for (let i = 0; i < pixels.length; i += 4) {
        const j = pixels[i + 3] * 4;
        if (!j) continue;

        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
    }
}

const defaultOptions = {
    minOpacity: 0.05,
    maxOpacity: 0.7,
    maxValue: 20,
    radius: 5,
    blur: 3,
    gradient: {
        0.0: "#FFFF00", // Pure Yellow
        0.2: "#FFD700", // Golden Yellow
        0.4: "#FFA500", // Orange
        0.6: "#FF8C00", // Dark Orange
        0.8: "#FF4500", // Orange-Red
        1.0: "#FF0000"  // Red
    }
    
    
    
};

function createCircleBrushCanvas(radius, blur) {
    const r2 = radius + blur;
    const circleCanvas = document.createElement('canvas');
    circleCanvas.width = circleCanvas.height = r2 * 2;
    const ctx = circleCanvas.getContext('2d');
    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return {circleCanvas, circleCanvasRadius: r2};
}

function createGradientCanvas(grad) {
    const gradientCanvas = document.createElement('canvas');
    const ctx = gradientCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradientCanvas.width = 1
    gradientCanvas.height = 256;
    for (const i in grad) gradient.addColorStop(+i, grad[i]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);
    return {gradientMap: ctx.getImageData(0, 0, 1, 256).data};
}

/**
 *
 * @param {number} size
 * @param {{x: number, y: number, value: number}[]} data
 * @param {typeof defaultOptions} options
 * @return {string}
 */
export default function useHeatmap(size, data, options = defaultOptions) {
    return useMemo(() => {
        if (size === 1) return null;
        const {
            minOpacity,
            maxOpacity,
            maxValue,
            radius,
            blur,
            gradient,
        } = {...defaultOptions, ...options}

        // init canvas
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);

        const {circleCanvas, circleCanvasRadius} = createCircleBrushCanvas(radius, blur);
        const {gradientMap} = createGradientCanvas(gradient);


        // render a grayscale heatmap by putting a blurred circle at each data point
        for (const {x, y, value} of data) {
            ctx.globalAlpha = Math.min(Math.max(value / maxValue, minOpacity), maxOpacity);
            ctx.drawImage(circleCanvas, x - circleCanvasRadius, y - circleCanvasRadius);
        }

        // colorize each pixel on the heatmap by mapping the opacity value to the right color
        const colored = ctx.getImageData(0, 0, size, size);
        // console.log(colored);
        colorize(colored.data, gradientMap);
        ctx.putImageData(colored, 0, 0);

        return canvas.toDataURL();
    }, [size, data, options])
}

export const HeatmapColorMap = styled('div')({
    background: `linear-gradient(to right, rgba(255,255,255,0) 0%, ${
        Object.entries(defaultOptions.gradient)
            .sort((a, b) => a[0] - b[0])
            .map(([stop, color]) => `${color} ${stop * 100}%`)
            .join(', ')
    })`,
})