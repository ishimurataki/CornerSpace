'use client';

import React, { useRef, useEffect } from 'react';

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        let radius = 100 * Math.sin(frameCount * 0.01) ** 2;
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) return;

        const context = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        if (context == null) return;

        let frameCount = 0;
        let animationFrameId: number;
        const render = () => {
            frameCount++;
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, []);

    return <canvas ref={canvasRef} className="border-4 border-pastel-green h-full w-full min-h-0 min-w-0" />
}