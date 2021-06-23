import { gl } from "./main";
import { setUniformMat, currentShader } from "./shaders";

import { Mesh } from "webgl-obj-loader";
import { vec3, mat4 } from 'gl-matrix';

export interface Model {
	indices: Array<number>;
	vertices: Array<number>;
	normals?: Array<number>;
	colors?: Array<number>;
	uvs?: Array<number>;
	iBuffer?: WebGLBuffer;
	vBuffer?: WebGLBuffer;
	nBuffer?: WebGLBuffer;
	cBuffer?: WebGLBuffer;
	uvBuffer?: WebGLBuffer;
}

export class StaticObject {
	models: Array<{model: Model, pos: vec3, rot?: vec3, scale?: vec3}>;
	constructor() {
		this.models = [];
	}
	public addModel(model: Model, pos: vec3, rot?: vec3, scale?: vec3) {
		this.models.push({model: model, pos: pos, rot: rot, scale: scale});
	}
	public render() {
		let modelMat = mat4.create();
		for (let m of this.models) {
			mat4.identity(modelMat);
			if (m.rot) {
				mat4.rotateZ(modelMat, modelMat, m.rot[2]);
				mat4.rotateX(modelMat, modelMat, m.rot[0]);
				mat4.rotateY(modelMat, modelMat, m.rot[1]);
			}
			if (m.scale) {
				mat4.scale(modelMat, modelMat, m.scale);
			}
			mat4.translate(modelMat, modelMat, m.pos);
			setUniformMat(currentShader, 'model', modelMat);
			renderModel(m.model);
		}
	}
}

export function createBuffer(buffer: Array<number>) {
	const vertexBuf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer),
		gl.STATIC_DRAW);
	return vertexBuf;
}

export function createIndexBuffer(buffer: Array<number>) {
	const indexBuf = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(buffer),
		gl.STATIC_DRAW);
	return indexBuf;
}

export function bindBuffer(buffer: WebGLBuffer) {
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
}

export function bindIndexBuffer(buffer: WebGLBuffer) {
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
}

export async function loadOBJ(url: string) {
	let resp = await fetch(url);
	let obj = await resp.text();
	let mesh = new Mesh(obj);
	let model = <Model> {
		indices: mesh.indices,
		vertices: mesh.vertices,
		normals: mesh.vertexNormals,
		uvs: mesh.textures,
	};
	model.iBuffer = createIndexBuffer(model.indices);
	model.vBuffer = createBuffer(model.vertices);
	model.nBuffer = createBuffer(model.normals);
	model.uvBuffer = createBuffer(model.uvs);

	const coord = 0;
	bindBuffer(model.vBuffer);
	gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(coord);

	const normal = 1;
	bindBuffer(model.nBuffer);
	gl.vertexAttribPointer(normal, 3, gl.FLOAT, true, 0, 0);
	gl.enableVertexAttribArray(normal);

	const tex = 2;
	bindBuffer(model.uvBuffer);
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, true, 0, 0);
	gl.enableVertexAttribArray(tex);

	return model;
}

export async function renderModel(model: Model) {
	bindIndexBuffer(model.iBuffer);
	bindBuffer(model.vBuffer);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
	bindBuffer(model.nBuffer);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, true, 0, 0);
	bindBuffer(model.uvBuffer);
	gl.vertexAttribPointer(2, 2, gl.FLOAT, true, 0, 0);
	gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
}

// vim: ts=2 sts=2 sw=2 noexpandtab
