import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { useUser } from "../context/UserContext";
import OpenSimplexNoise from "../utils/OpenSimplexNoise";
import lumonImg from "../assets/icon.png";
import nopeImg from "../assets/nope.png";

const vertShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

const fragShader = `
#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.1415926538
varying vec2 vTexCoord;
uniform sampler2D u_tex;
uniform vec2 u_resolution;
vec2 curvature = vec2(4.5);

vec2 curveRemapUV(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}
 
void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y; 
  vec2 remappedUV = curveRemapUV(vec2(uv.xy));
  vec4 baseColor = texture2D(u_tex, remappedUV);
  float line_count = 400.0;
  float opacity = 0.65;
  float y_lines = sin(remappedUV.y * line_count * PI * 2.0);
  y_lines = (y_lines * 0.5 + 0.5) * 0.9 + 0.1;
  float x_lines = sin(remappedUV.x * line_count * PI * 2.0);
  x_lines = (x_lines * 0.5 + 0.5) * 0.9 + 0.1;
  vec4 scan_line = vec4(vec3(pow(y_lines, opacity)), 1.0);
  vec4 scan_line_x = vec4(vec3(pow(x_lines, opacity)), 1.0);
  float avg = baseColor.r + baseColor.g + baseColor.b / 3.0;
  if (avg > 0.5) {
    baseColor *= vec4(vec3(0.4, 1.0, 1.2), 1.0) * 8.0;
  } else {
      baseColor *= vec4(vec3(0.2, 1.2, 1.5), 1.0) * 2.0;
  }
  baseColor *= scan_line;
  baseColor *= scan_line_x;
  if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
        gl_FragColor = baseColor;
    }
}
`;

const MacrodataRefinement = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { user, updateUser } = useUser();

    const pointsRef = useRef(user.total_points);
    pointsRef.current = user.total_points;

    const addPoints = (amount: number) => {
        updateUser({ total_points: pointsRef.current + amount });
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const sketch = (p: p5) => {
            let osn: OpenSimplexNoise;
            let numbers: Data[] = [];
            let refined: Bin[] = [];
            let goal = 500;
            let buffer = 50;
            let cols: number, rows: number;
            let r: number, baseSize: number;
            let crtShader: p5.Shader;
            let shaderLayer: p5.Graphics;
            let g: p5.Graphics;
            let lumonImage: p5.Image;
            let nopeImage: p5.Image;

            let refining = false;
            let refineTX = 0, refineTY = 0, refineBX = 0, refineBY = 0;
            let zoff = 0;
            let nope = false;
            let nopeTime = 0;
            let gameComplete = false;
            let victoryTime = 0;

            const palette = {
                BG: '#010A13',
                FG: '#ABFFE9',
                SELECT: '#EEFFFF',
                LEVELS: { 'WO': '#05C3A8', 'FC': '#1EEFFF', 'DR': '#DF81D5', 'MA': '#F9ECBB' } as Record<string, string>
            };

            class Bin {
                w: number; i: number; x: number; y: number; goal: number; levelGoal: number;
                levels: Record<string, number>; count: number; levelsYOffset: number;
                lastRefinedTime: number; showLevels = false; openingAnimation = false;
                closingAnimation = false; lidAngle = 180; animationStartTime = 0;

                constructor(w: number, i: number, goal: number) {
                    this.w = w; this.i = i; this.x = i * w + w * 0.5; this.y = g.height - buffer * 1.5;
                    this.goal = goal; this.levelGoal = this.goal / 4; this.levelsYOffset = buffer * 1.7;
                    this.lastRefinedTime = p.millis(); this.levels = { WO: 0, FC: 0, DR: 0, MA: 0 }; this.count = 0;
                }

                addNumber() {
                    const keys = ['WO', 'FC', 'DR', 'MA'];
                    const options = keys.filter(k => this.levels[k] < this.levelGoal);
                    if (options.length > 0) {
                        const key = p.random(options);
                        this.levels[key]++;
                        this.showLevels = true;
                        addPoints(10);

                        // Check if all bins are complete
                        const allComplete = refined.every(bin => bin.count >= bin.goal);
                        if (allComplete && !gameComplete) {
                            gameComplete = true;
                            victoryTime = p.millis();
                            addPoints(500); // Bonus points for completion
                        }
                    }
                }

                open() {
                    if (!this.showLevels) {
                        this.lidAngle = 180; this.animationStartTime = p.millis();
                        this.openingAnimation = true; this.showLevels = true;
                    }
                }

                show() {
                    this.count = Object.values(this.levels).reduce((a, b) => a + b, 0);
                    let perc = this.count / this.goal;
                    g.push(); g.rectMode(p.CENTER);
                    let rw = this.w - this.w * 0.25;
                    g.noStroke(); g.fill(palette.FG); g.rectMode(p.CORNER);
                    let h = buffer * 0.25;
                    g.rect(this.x - rw * 0.5, this.y + buffer * 0.3 - h * 0.5, rw * perc, h);
                    g.fill(palette.FG); g.textAlign(p.CENTER, p.CENTER); g.textSize(14);
                    g.text(p.nf(this.i + 1, 2, 0), this.x, this.y);
                    g.textAlign(p.LEFT, p.CENTER); g.fill(palette.BG);
                    g.text(`${Math.floor(perc * 100)}%`, this.x - rw * 0.45, this.y + buffer * 0.3);
                    g.pop();
                }
            }

            class Data {
                num: number; homeX: number; homeY: number; x: number; y: number;
                color: string; alpha: number; sz: number; refined = false; binIt = false;
                bin: Bin | undefined; binPause = 8;

                constructor(x: number, y: number) {
                    this.num = p.floor(p.random(10)); this.homeX = x; this.homeY = y;
                    this.x = x; this.y = y; this.color = palette.FG; this.alpha = 255; this.sz = baseSize;
                }

                refine(bin: Bin) { this.binIt = true; this.bin = bin; }

                goBin() {
                    if (!this.bin) return;
                    this.bin.open();
                    if (this.binPause <= 0) {
                        const dx = this.bin.x - this.x; const dy = this.bin.y - this.y;
                        let easing = p.map(p.abs(dy), this.bin.y, 0, 0.02, 0.1);
                        this.x += dx * easing; this.y += p.max(dy * easing, -20);
                        this.alpha = p.map(this.y, this.homeY, this.bin.y, 255, 5);
                        this.bin.lastRefinedTime = p.millis();
                    } else { this.binPause--; }

                    if (p.dist(this.x, this.y, this.bin.x, this.bin.y) < 5) {
                        this.bin.addNumber();
                        this.reset();
                    }
                }

                reset() {
                    this.num = p.floor(p.random(10)); this.x = this.homeX; this.y = this.homeY;
                    this.refined = false; this.binIt = false; this.bin = undefined;
                    this.color = palette.FG; this.alpha = 255; this.binPause = 8;
                }

                goHome() {
                    this.x = p.lerp(this.x, this.homeX, 0.1);
                    this.y = p.lerp(this.y, this.homeY, 0.1);
                    this.sz = p.lerp(this.sz, baseSize, 0.1);
                }

                inside(x1: number, y1: number, x2: number, y2: number) {
                    return (this.x > p.min(x1, x2) && this.x < p.max(x1, x2) && this.y > p.min(y1, y2) && this.y < p.max(y1, y2));
                }

                show() {
                    const digitSize = this.binIt ? p.lerp(this.sz, baseSize * 2.5, p.map(this.binPause, 8, 0, 0, 1)) : this.sz;
                    g.textSize(digitSize); g.textAlign(p.CENTER, p.CENTER);
                    const c = p.color(this.color); c.setAlpha(this.alpha);
                    g.fill(c); g.stroke(c); g.text(this.num, this.x, this.y);
                }

                turn(col: string) { this.color = col; }
                size(s: number) { this.sz = s; }
            }

            p.setup = async () => {
                const w = containerRef.current?.clientWidth || 800;
                const h = containerRef.current?.clientHeight || 600;
                p.createCanvas(w, h);
                g = p.createGraphics(w, h);
                crtShader = p.createShader(vertShader, fragShader);
                shaderLayer = p.createGraphics(w, h, p.WEBGL);
                shaderLayer.noStroke();

                // Load images asynchronously
                nopeImage = await p.loadImage(nopeImg);

                startOver();
            };

            const startOver = () => {
                const w = g.width; const h = g.height; const smaller = p.min(w, h);
                r = (smaller - buffer * 2) / 10; baseSize = r * 0.33;
                osn = new OpenSimplexNoise(Date.now());
                cols = p.floor(w / r); rows = p.floor((h - buffer * 2) / r);
                numbers = [];
                let wBuffer = w - cols * r;

                for (let j = 0; j < rows; j++) {
                    for (let i = 0; i < cols; i++) {
                        let x = i * r + r * 0.5 + wBuffer * 0.5;
                        let y = j * r + r * 0.5 + buffer;
                        numbers.push(new Data(x, y));
                    }
                }
                refined = [];
                for (let i = 0; i < 5; i++) refined.push(new Bin(w / 5, i, goal / 5));
            };

            p.draw = () => {
                g.background(palette.BG);
                let yoff = 0; let inc = 0.2;
                for (let i = 0; i < cols; i++) {
                    let xoff = 0;
                    for (let j = 0; j < rows; j++) {
                        const idx = i + j * cols; const num = numbers[idx];
                        if (!num) continue;
                        if (num.binIt) { num.goBin(); num.show(); continue; }
                        let n = osn.noise3D(xoff, yoff, zoff) - 0.4;
                        if (n < 0) { n = 0; num.goHome(); } else { num.x += p.random(-1, 1); num.y += p.random(-1, 1); }
                        let sz = n * baseSize * 4 + baseSize;
                        let d = p.dist(p.mouseX, p.mouseY, num.x, num.y);
                        if (d < g.width * 0.1) { num.x += p.random(-1, 1); num.y += p.random(-1, 1); } else { num.goHome(); }
                        num.size(sz); num.show(); xoff += inc;
                    }
                    yoff += inc;
                }
                zoff += 0.005;
                refined.forEach(bin => bin.show());

                if (refining) {
                    g.push(); g.rectMode(p.CORNERS); g.stroke(palette.FG); g.noFill();
                    g.rect(refineTX, refineTY, refineBX, refineBY);
                    numbers.forEach(num => {
                        if (num.inside(refineTX, refineTY, refineBX, refineBY) && num.sz > baseSize) {
                            num.turn(palette.SELECT); num.refined = true;
                        } else { num.turn(palette.FG); num.refined = false; }
                    });
                    g.pop();
                }

                if (lumonImage) { g.imageMode(p.CORNER); g.tint(palette.FG); g.image(lumonImage, g.width - 100, 10, 80, 40); }
                if (nope && nopeImage) { g.imageMode(p.CENTER); g.image(nopeImage, g.width / 2, g.height / 2); if (p.millis() - nopeTime > 1000) nope = false; }

                // Victory popup
                if (gameComplete && p.millis() - victoryTime < 5000) {
                    g.push();
                    g.rectMode(p.CENTER);
                    g.fill(0, 0, 0, 200);
                    g.noStroke();
                    const boxW = g.width * 0.6;
                    const boxH = 200;
                    g.rect(g.width / 2, g.height / 2, boxW, boxH, 10);

                    g.stroke(palette.FG);
                    g.strokeWeight(3);
                    g.noFill();
                    g.rect(g.width / 2, g.height / 2, boxW, boxH, 10);

                    g.noStroke();
                    g.fill(palette.FG);
                    g.textAlign(p.CENTER, p.CENTER);
                    g.textSize(32);
                    g.text('QUOTA COMPLETE', g.width / 2, g.height / 2 - 40);
                    g.textSize(20);
                    g.text('Excellent work!', g.width / 2, g.height / 2);
                    g.textSize(24);
                    g.fill(palette.LEVELS.MA);
                    g.text('+50 BONUS POINTS', g.width / 2, g.height / 2 + 40);
                    g.pop();
                }

                shaderLayer.rect(0, 0, g.width, g.height); shaderLayer.shader(crtShader);
                crtShader.setUniform('u_tex', g); crtShader.setUniform('u_resolution', [g.width, g.height]);
                p.image(shaderLayer, 0, 0, p.width, p.height);
            };

            p.mousePressed = () => {
                if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                    refining = true; refineTX = p.mouseX; refineTY = p.mouseY; refineBX = p.mouseX; refineBY = p.mouseY;
                }
            };

            p.mouseDragged = () => { if (refining) { refineBX = p.mouseX; refineBY = p.mouseY; } };

            p.mouseReleased = () => {
                if (!refining) return;
                refining = false;
                let refinery = numbers.filter(n => n.inside(refineTX, refineTY, refineBX, refineBY) && n.refined);
                let total = numbers.filter(n => n.inside(refineTX, refineTY, refineBX, refineBY)).length;
                if (refinery.length > 0 && refinery.length > 0.5 * total) {
                    const availableBins = refined.filter(b => b.count < b.goal);
                    if (availableBins.length > 0) { const targetBin = p.random(availableBins); refinery.forEach(n => n.refine(targetBin)); }
                } else if (total > 0) { nope = true; nopeTime = p.millis(); }
                numbers.forEach(n => { n.turn(palette.FG); n.refined = false; });
            };

            p.windowResized = () => {
                const w = containerRef.current?.clientWidth || 800; const h = containerRef.current?.clientHeight || 600;
                p.resizeCanvas(w, h); g.resizeCanvas(w, h); shaderLayer.resizeCanvas(w, h); startOver();
            };
        };

        const p5Instance = new p5(sketch, containerRef.current);
        return () => { p5Instance.remove(); };
    }, []);

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default MacrodataRefinement;