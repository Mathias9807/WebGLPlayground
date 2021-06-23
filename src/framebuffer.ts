import { gl } from './main';
import { currentShader, setUniformMat } from './shaders';

import { vec3, vec4, mat4 } from 'gl-matrix';

export class Texture {
	tex: WebGLTexture;
	width: number;
	height: number;
	constructor(tex: WebGLTexture, width: number, height: number) {
		this.tex = tex;
		this.width = width;
		this.height = height;
	}
	public bind(slot: number) {
		bindTexture(this.tex, slot);
	}
}

export class Framebuffer {
	fb: WebGLFramebuffer;
	tex: Texture;
	width: number;
	height: number;
	constructor(fb: WebGLFramebuffer, width: number, height: number) {
		this.fb = fb;
		this.width = width;
		this.height = height;
	}
	public bind() {
		bindFramebuffer(this.fb);
		gl.viewport(0, 0, this.width, this.height);
	}
	public clear(color?: vec4, depth?: number) {
		this.bind();
		if (color) gl.clearColor(color[0], color[1], color[2], color[3]);
		gl.clearDepth(depth ?? 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}

export class Camera {
	fb: Framebuffer;
	pos: vec3; rot: vec3;
	extraPos: vec3; // Applied after normal transform
	world: mat4; proj: mat4;
	constructor() {
		this.pos = vec3.create();
		this.rot = vec3.create();
		this.extraPos = vec3.create();
		this.world = mat4.create();
		this.proj = mat4.create();
		mat4.identity(this.proj);
	}
	public setFramebuffer(fb: Framebuffer) {
		this.fb = fb;
		this.fb.bind();
	}
	public use() {
		this.fb.bind();
		mat4.identity(this.world);
		let t = vec3.create();
		vec3.negate(t, this.pos);
		let x = vec3.create();
		vec3.negate(x, this.extraPos);
		mat4.translate(this.world, this.world, x);
		mat4.rotateZ(this.world, this.world, this.rot[2]);
		mat4.rotateX(this.world, this.world, this.rot[0]);
		mat4.rotateY(this.world, this.world, this.rot[1]);
		mat4.translate(this.world, this.world, t);

		setUniformMat(currentShader, 'world', this.world);
		setUniformMat(currentShader, 'proj', this.proj);
	}
}

export function clearColor(color: vec4) {
	gl.clearColor(color[0], color[1], color[2], color[3]);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

export function clearDepth(depth: number=0.0) {
	gl.clearDepth(depth);
	gl.clear(gl.DEPTH_BUFFER_BIT);
}

export function createDepthTexture(width: number, height: number) {
	const tex = gl.createTexture();
	bindTexture(tex, 0);
	const data = null;
	// @ts-ignore
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0,
		gl.DEPTH_COMPONENT, gl.FLOAT, data);

	// Set the filtering so we don't need mips
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	// @ts-ignore
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);

	return new Texture(tex, width, height);
}

export function createTexture(width: number, height: number, data?: ArrayBufferView | HTMLImageElement, options?: {nearest: boolean}) {
	const tex = gl.createTexture();
	bindTexture(tex, 0);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA,
	// @ts-ignore
		gl.UNSIGNED_BYTE, data);

	// Set the filtering so we don't need mips
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,
		options?.nearest ? gl.NEAREST : gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
		options?.nearest ? gl.NEAREST : gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	return new Texture(tex, width, height);
}

export async function loadTexture(url: string, options?) {
	let img = new Image();
	await new Promise((resolve, reject) => {
		img.src = url;
		img.onload = resolve;
	});
	return createTexture(img.width, img.height, img, options);
}

export function bindTexture(tex: WebGLTexture, slot: number) {
	gl.activeTexture(gl['TEXTURE' + slot]);
	gl.bindTexture(gl.TEXTURE_2D, tex);
}

export function createFramebuffer(width: number, height: number, options?: {depth}) {
	let fb = new Framebuffer(gl.createFramebuffer(), width, height);
	bindFramebuffer(fb.fb);

	if (options?.depth) {
		let depth = createDepthTexture(width, height);
		fb.tex = depth;
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depth.tex, 0);
		return fb;
	}

	let tex = createTexture(width, height);
	fb.tex = tex;
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D, tex.tex, 0);

	let depth = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth);

	return fb;
}

export function bindFramebuffer(fb: WebGLFramebuffer) {
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
}

// vim: ts=2 sts=2 sw=2 noexpandtab
