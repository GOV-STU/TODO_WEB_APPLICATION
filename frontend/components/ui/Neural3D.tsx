"use client";

import { useEffect, useRef } from "react";

export function Neural3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 120;
    canvas.height = 40;

    // 3D Neural Network Node
    class Node3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;

      constructor() {
        this.x = (Math.random() - 0.5) * 2;
        this.y = (Math.random() - 0.5) * 2;
        this.z = (Math.random() - 0.5) * 2;
        this.vx = (Math.random() - 0.5) * 0.02;
        this.vy = (Math.random() - 0.5) * 0.02;
        this.vz = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Bounce off boundaries
        if (Math.abs(this.x) > 1.5) this.vx *= -1;
        if (Math.abs(this.y) > 1.5) this.vy *= -1;
        if (Math.abs(this.z) > 1.5) this.vz *= -1;
      }

      project(rotationX: number, rotationY: number) {
        // Rotate around Y axis
        let x = this.x * Math.cos(rotationY) - this.z * Math.sin(rotationY);
        let z = this.x * Math.sin(rotationY) + this.z * Math.cos(rotationY);

        // Rotate around X axis
        let y = this.y * Math.cos(rotationX) - z * Math.sin(rotationX);
        z = this.y * Math.sin(rotationX) + z * Math.cos(rotationX);

        // Perspective projection
        const scale = 200 / (200 + z * 50);
        return {
          x: x * scale * 20 + canvas.width / 2,
          y: y * scale * 20 + canvas.height / 2,
          scale: scale,
        };
      }
    }

    // Create nodes
    const nodes: Node3D[] = [];
    for (let i = 0; i < 12; i++) {
      nodes.push(new Node3D());
    }

    let rotationX = 0;
    let rotationY = 0;

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rotationX += 0.005;
      rotationY += 0.008;

      // Update and project nodes
      const projectedNodes = nodes.map((node) => {
        node.update();
        return {
          node,
          projected: node.project(rotationX, rotationY),
        };
      });

      // Sort by z-depth for proper rendering
      projectedNodes.sort((a, b) => b.projected.scale - a.projected.scale);

      // Draw connections
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 0.5;
      projectedNodes.forEach((nodeA, i) => {
        projectedNodes.slice(i + 1).forEach((nodeB) => {
          const dx = nodeA.node.x - nodeB.node.x;
          const dy = nodeA.node.y - nodeB.node.y;
          const dz = nodeA.node.z - nodeB.node.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 1.2) {
            ctx.globalAlpha = (1 - distance / 1.2) * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodeA.projected.x, nodeA.projected.y);
            ctx.lineTo(nodeB.projected.x, nodeB.projected.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      projectedNodes.forEach(({ projected }) => {
        const gradient = ctx.createRadialGradient(
          projected.x,
          projected.y,
          0,
          projected.x,
          projected.y,
          3 * projected.scale
        );
        gradient.addColorStop(0, "#06b6d4");
        gradient.addColorStop(0.5, "#3b82f6");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.globalAlpha = projected.scale * 0.8;
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 2 * projected.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="opacity-80"
      style={{ width: "120px", height: "40px" }}
    />
  );
}
