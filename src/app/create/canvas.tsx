'use client';

import React, { useRef, useEffect } from 'react';

import CanvasState from '@/app/create/canvas-state';
import { PolarCamera } from '@/lib/polar-camera';
import Scene from '@/lib/renderables/scene';
import Renderer from "@/lib/renderer";
import Controls from '@/lib/controls';

import initShaderProgram from "@/lib/utils/shader-helper";
import { plainVertexShaderSource, plainFragmentShaderSource } from "@/lib/shaders/plain-shader";
import { tracerVertexSource, tracerFragmentSource } from "@/lib/shaders/tracer-shader";
import { renderFragmentSource, renderVertexSource } from "@/lib/shaders/render-shader";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) {
            alert("Couldn't find canvas element.");
            return;
        }
        CanvasState.canvas = canvas;

        const gl = canvas.getContext('webgl');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        if (gl == null) {
            alert("Unable to initialize WebGL context. Your browser or machine may not support it.");
            return;
        }

        const camera = new PolarCamera(CanvasState.canvas.clientWidth, CanvasState.canvas.clientHeight);
        const scene = new Scene(gl);
        const controls = new Controls();
        controls.registerControls();
        CanvasState.camera = camera;
        CanvasState.scene = scene;
        CanvasState.controls = controls;

        const plainShaderProgram: WebGLShader | null = initShaderProgram(gl, plainVertexShaderSource, plainFragmentShaderSource);
        if (plainShaderProgram == null) {
            alert("Could not compile plain shader program");
            return;
        }

        const tracerShaderProgram: WebGLShader | null = initShaderProgram(gl,
            tracerVertexSource,
            tracerFragmentSource(CanvasState.divisionFactor));
        if (tracerShaderProgram == null) {
            alert("Could not compile tracer shader program");
            return;
        }

        const renderShaderProgram: WebGLShader | null = initShaderProgram(gl, renderVertexSource, renderFragmentSource);
        if (renderShaderProgram == null) {
            alert("Could not compile render shader program");
            return;
        }

        const renderer = new Renderer(gl, tracerShaderProgram, renderShaderProgram, plainShaderProgram);
        CanvasState.renderer = renderer;

        gl.useProgram(plainShaderProgram);

        let animationFrameId: number;
        const render = (now: number) => {
            renderer.tick(now);
            renderer.render(now);
            CanvasState.previousTime = now;
            animationFrameId = requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, []);

    return <canvas ref={canvasRef} className="border-4 border-pastel-green h-full w-full min-h-0 min-w-0" />
}