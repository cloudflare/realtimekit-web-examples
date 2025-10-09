import React from 'react';

export enum WatermarkPosition {
    TopLeft = "left top",
    TopRight = "right top",
    BottomLeft = "left bottom",
    BottomRight = "right bottom"
}

export interface WatermarkSize {
    width?: number
    height?: number
}

export interface WatermarkConfig {
    url: string;
    position: WatermarkPosition;
    size: WatermarkSize;
    opacity: number;
    enabled: boolean;
}

export default function Watermark(props: {
    config: WatermarkConfig;
}) {
    const { config } = props;
    const { url, position, size, opacity } = config;

    let width = "auto", height = "auto";
    if (size.width) {
        width = `${size.width}px`;
    }

    if (size.height) {
        height = `${size.height}px`;
    }
    
    const style: React.CSSProperties = {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${url})`,
        backgroundSize: `${width} ${height}`,
        backgroundPosition: position,
        backgroundRepeat: "no-repeat",
        backgroundOrigin: "content-box",
        opacity: opacity,
        padding: "2vh 2vw",
        zIndex: 1000,
        boxSizing: "border-box",
    };

    return <div style={style} />;
}