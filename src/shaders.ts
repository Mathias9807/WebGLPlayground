import { gl } from "./main";

import { glMatrix, mat4 } from 'gl-matrix';

export let shaderRoot = 'shaders/';

export let currentShader: Shader;

export class Shader {
	public name: string;
	public shader: WebGLShader;
	private uniforms: Array<number>;
	constructor(name, shader) {
		this.name = name;
		this.shader = shader;
	}
	public getUniformLoc(name: string) {
		let loc = this.uniforms?.[name];
		if (!loc) loc = gl.getUniformLocation(this.shader, name);
		return loc;
	}
	public use() {
		useShader(this);
	}
};

let shaderAttrBuffer: Array<Array<string>> = [];

export function useShader(shader: Shader) {
	if (currentShader == shader || !shader) return;
	currentShader = shader;
	gl.useProgram(shader.shader);
	return currentShader;
}

export async function compileFragmentShader(path: string) {
	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, await fetch(path)
		.then(function(response) {return response.text()}));
	gl.compileShader(fragShader);
	let shaderLog = gl.getShaderInfoLog(fragShader);
	if (shaderLog) console.error('Fragment shader compilation failed: ' + shaderLog);
	return fragShader;
}

export async function compileVertexShader(path: string) {
	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, await fetch(path)
		.then(function(response) {return response.text()}));
	gl.compileShader(vertShader);
	let shaderLog = gl.getShaderInfoLog(vertShader);
	if (shaderLog) console.error('Vertex shader compilation failed: ' + shaderLog);
	return vertShader;
}

export async function compileShader(shader: string) {
	const vertShader = await compileVertexShader(shaderRoot + shader + '.vert');
	const fragShader = await compileFragmentShader(shaderRoot + shader + '.frag');
	const prog = gl.createProgram();
	gl.attachShader(prog, vertShader);
	gl.attachShader(prog, fragShader);
	gl.linkProgram(prog);
	return useShader(new Shader(shader, prog));
}

export function setUniformf(shader: Shader, attr: string, val: Array<number> | number) {
	useShader(shader);
	let loc = shader.getUniformLoc(attr);
	// The worst idea you ever seen ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	gl[Array.isArray(val) ? `uniform${val.length}fv` : `uniform1f`](loc, val);
}

export function setUniformi(shader: Shader, attr: string, val: Array<number> | number) {
	useShader(shader);
	let loc = shader.getUniformLoc(attr);
	gl[Array.isArray(val) ? `uniform${val.length}iv` : `uniform1i`](loc, val);
}

export function setUniformMat(shader: Shader, attr: string, val: mat4) {
	useShader(shader);
	let loc = shader.getUniformLoc(attr);
	gl[`uniformMatrix${Math.sqrt(val.length)}fv`](loc, false, val);
}

// vim: ts=2 sts=2 sw=2 noexpandtab
