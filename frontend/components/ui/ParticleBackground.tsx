"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;

        // Random colors: cyan, blue, purple, pink
        const colors = ["#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Matrix rain character class
    class MatrixChar {
      x: number;
      y: number;
      speed: number;
      char: string;
      opacity: number;

      constructor() {
        this.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        this.y = Math.random() * canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.char = String.fromCharCode(0x30A0 + Math.random() * 96); // Japanese katakana
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = "#06b6d4";
        ctx.globalAlpha = this.opacity;
        ctx.font = "14px monospace";
        ctx.fillText(this.char, this.x, this.y);
        ctx.globalAlpha = 1;
      }
    }

    // Create particles and matrix characters
    const particles: Particle[] = [];
    const matrixChars: MatrixChar[] = [];

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 30; i++) {
      matrixChars.push(new MatrixChar());
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update matrix characters
      matrixChars.forEach((char) => {
        char.update();
        char.draw();
      });

      // Draw and update particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.strokeStyle = "#06b6d4";
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 1 }}
    />
  );
}
