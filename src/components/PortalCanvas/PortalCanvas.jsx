"use client";

import { useRef, useEffect } from "react";
import styles from "./PortalCanvas.module.css";

export default function PortalCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let tick = 0;

    const STARS = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.84,
      r: Math.random() * 1.0 + 0.2,
      a: Math.random() * 0.5 + 0.15,
    }));

    const ROCKS = Array.from({ length: 9 }, () => {
      const sides = 4 + Math.floor(Math.random() * 3);
      return {
        x: 0.06 + Math.random() * 0.88,
        y: 0.04 + Math.random() * 0.54,
        size: 6 + Math.random() * 16,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
        sides,
        verts: Array.from({ length: sides }, () => 0.65 + Math.random() * 0.7),
      };
    });

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function drawBg(w, h) {
      const g = ctx.createRadialGradient(w * 0.42, h * 0.3, w * 0.02, w * 0.42, h * 0.3, w * 0.95);
      g.addColorStop(0, "#15103c");
      g.addColorStop(0.45, "#0c0820");
      g.addColorStop(1, "#04020c");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    function drawStars(w, h) {
      STARS.forEach(({ x, y, r, a }) => {
        ctx.beginPath();
        ctx.arc(x * w, y * h, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 185, 255, ${a})`;
        ctx.fill();
      });
    }

    function drawRocks(w, h) {
      ROCKS.forEach((rock) => {
        rock.angle += rock.rotSpeed;
        const ry = rock.y * h + Math.sin(tick * 0.007 + rock.phase) * 5;
        ctx.save();
        ctx.translate(rock.x * w, ry);
        ctx.rotate(rock.angle);
        ctx.beginPath();
        for (let i = 0; i < rock.sides; i++) {
          const a = (i / rock.sides) * Math.PI * 2;
          const r = rock.size * rock.verts[i];
          i === 0
            ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(44, 28, 80, 0.65)";
        ctx.strokeStyle = "rgba(105, 68, 178, 0.45)";
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });
    }

    function drawRange(w, h, peaks, topColor, botColor) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      peaks.forEach(([px, py]) => ctx.lineTo(px * w, py * h));
      ctx.lineTo(w, h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, h * 0.5, 0, h);
      g.addColorStop(0, topColor);
      g.addColorStop(1, botColor);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function frame() {
      tick++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      drawBg(w, h);
      drawStars(w, h);
      drawRocks(w, h);

      // Back mountain range
      drawRange(w, h,
        [[0,0.77],[0.07,0.65],[0.14,0.73],[0.20,0.59],[0.27,0.69],[0.33,0.56],
         [0.40,0.67],[0.46,0.54],[0.50,0.65],[0.56,0.55],[0.62,0.67],[0.68,0.53],
         [0.74,0.64],[0.80,0.58],[0.87,0.67],[0.93,0.62],[1.0,0.75]],
        "rgba(26, 15, 62, 0.65)", "rgba(8, 5, 20, 0.95)"
      );

      // Front mountain range
      drawRange(w, h,
        [[0,0.87],[0.06,0.79],[0.12,0.87],[0.17,0.75],[0.23,0.83],[0.29,0.71],
         [0.35,0.82],[0.41,0.69],[0.46,0.79],[0.50,0.75],[0.54,0.81],[0.60,0.70],
         [0.66,0.79],[0.72,0.74],[0.78,0.82],[0.84,0.76],[0.90,0.84],[0.96,0.79],[1.0,0.87]],
        "rgba(12, 7, 30, 0.96)", "rgba(4, 2, 10, 1)"
      );

      // Subtle mountain rim glow
      ctx.beginPath();
      [[0,0.87],[0.06,0.79],[0.12,0.87],[0.17,0.75],[0.23,0.83],[0.29,0.71],
       [0.35,0.82],[0.41,0.69],[0.46,0.79],[0.50,0.75],[0.54,0.81],[0.60,0.70],
       [0.66,0.79],[0.72,0.74],[0.78,0.82],[0.84,0.76],[0.90,0.84],[0.96,0.79],[1.0,0.87]
      ].forEach(([px, py], i) => {
        i === 0 ? ctx.moveTo(px * w, py * h) : ctx.lineTo(px * w, py * h);
      });
      ctx.strokeStyle = "rgba(130, 85, 210, 0.14)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={styles.canvas} />;
}
