# MPG v1.0.0 — MP Graphics Engine

A 2D desktop graphics package for MP. Features: persistent `stamp()` shapes, `clone()`, `goto()`, `move()`, input (`key`, `mox`, `moy`, `moc`), and frame-paced `update()`.

## Requirements

- Windows, Node.js / npm
- MP VS Code extension **v0.6.6 MPG bridge** (not v0.6.5)
- Electron desktop runtime (installed separately, requires an internet connection)

## Install from this repository

1. Download the GitHub repository ZIP or clone this repo.
2. Open a terminal in the repository folder and run `npm install`.
3. Copy this whole folder to `%USERPROFILE%\.mp\packages\MPG`, including `node_modules` (or run `npm install` again in the destination).
4. Install MP v0.6.6 MPG bridge VSIX in VS Code.
5. Open `examples/moving-square.mp` in VS Code and click Run.

**getex:** After publishing this repository to `mmangaming999/MPG` with the Git tag `v1.0.0`, use the separately provided **getex 0.2.0** to run `getex MPG`. Existing getex 0.1.0 cannot install MPG. This flow has not been verified against a live GitHub repository.

## API (27 functions)

`win(title,width,height)`, `quit()`, `isopen()`, `fps(rate)`, `clear([color])`, `update()`, `background(color)`.

`stamp(shape,size,color)`, `clone(id)`, `delete(id)`, `goto(x,y)` or `goto(id,x,y)`, `move(dx,dy)` or `move(id,dx,dy)`, `posx([id])`, `posy([id])`, `size(id,value)`, `color(id,value)`, `rotate(id,degrees)`, `touching(id,id)`.

`key(name)`, `keypressed(name)`, `mox()`, `moy()`, `moc([button])`.

`drawtext(text,x,y,size,color)`, `waitframe()`, `ticks()`, `show(id,bool)`.

`stamp` currently supports `square`, `rectangle`, `circle`, `triangle`, and `line`. Shape coordinates are center-based. Collision detection is approximate rotated AABB for v1.0. `update()` waits to cap the frame rate and sends the stored scene for rendering. Mouse coordinates are canvas-local, with Y increasing downward.

## Limits / verification

This is a first implementation. It has **not** been tested on a real Windows desktop with Electron installed here. The renderer and runtime require an installation test. The sample code is provided for testing, not a claim of verified production readiness. `waitframe()` and `update()` each wait, so don't call both every iteration unless you want an extra delay. `keypressed()` is checked against the last input event batch and may need refinement for very short taps. `clear(color)` sets the current background; `background(color)` sets it persistently. Windows closing ends the GUI session.

## Security

Electron runs locally with context isolation; renderer has no Node integration. Do not execute MP programs from untrusted authors; they compile to JavaScript.
