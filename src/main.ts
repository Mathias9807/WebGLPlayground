import { compileShader, setUniformf, setUniformi, setUniformMat, Shader, currentShader } from './shaders';
import { clearColor, clearDepth, Texture, loadTexture, Framebuffer, createFramebuffer, Camera } from './framebuffer';
import { createBuffer, createIndexBuffer, loadOBJ, renderModel, bindBuffer, bindIndexBuffer, Model, StaticObject } from './geometry';
import { glMatrix, mat4, vec3, vec4 } from 'gl-matrix';

export let gl: WebGLRenderingContext;

export let screenFb: Framebuffer;
export let shadowFb: Framebuffer;
export let tempFb: Framebuffer;

let shader: Shader, shadowShader: Shader, plainShader: Shader, gauss1: Shader;
let model: Model, plane: Model;
let scene: StaticObject;
let texture: Texture;
let camera: Camera, shadowCam: Camera;

const main = async () => {
	const canvas = <HTMLCanvasElement> document.querySelector('#glCanvas');
	// Initialize the GL context
	gl = canvas.getContext('webgl2');

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}

	gl.getExtension('EXT_color_buffer_float');
	gl.getExtension('OES_texture_float_linear');
	glMatrix.setMatrixArrayType(Array);
	gl.activeTexture(gl.TEXTURE0);
	
	shadowFb = createFramebuffer(256, 256, {'float': true, 'mipmap': true});
	tempFb = createFramebuffer(window.innerWidth, window.innerHeight);
	screenFb = new Framebuffer(null, window.innerWidth, window.innerHeight);
	screenFb.bind();

	camera = new Camera();
	camera.setFramebuffer(tempFb);
	camera.extraPos[2] = 3;

	shadowCam = new Camera();
	shadowCam.setFramebuffer(shadowFb);
	shadowCam.extraPos[2] = 3;
	shadowCam.rot[1] = -Math.PI / 4;
	shadowCam.rot[0] = Math.PI / 6;
	mat4.identity(shadowCam.proj);
	mat4.ortho(shadowCam.proj, -2, 2, -2, 2, 0, 5);

	shadowShader = await compileShader('variance');
	plainShader = await compileShader('plain');
	gauss1 = await compileShader('gauss1');
	setUniformi(plainShader, 'tex', 0);
	shader = await compileShader('shader');
	setUniformi(shader, 'tex', 0);
	setUniformi(shader, 'shadowTex', 1);

	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);

	scene = new StaticObject();
	scene.addModel(await loadOBJ('res/suzanne.obj'), [0,0,0], [0,0,0], [0.5,0.5,0.5]);
	scene.addModel(await loadOBJ('res/Wall.obj'), [0,0,0]);
	plane = await loadOBJ('res/plane.obj');

	texture = await loadTexture('checkers.png', {nearest: true});
	texture.bind(0);

	setInterval(render, 125);
}

let t = 0;
function render() {
	shadowShader.use();
	shadowCam.fb.clear();
	shadowCam.rot[1] += 0.05;
	shadowCam.use();
	scene.render();

	shader.use();
	let lightDir = vec4.create();
	lightDir[2] = -1;
	vec4.transformMat4(lightDir, lightDir, shadowCam.world);
	vec4.transformMat4(lightDir, lightDir, shadowCam.proj);
	vec4.normalize(lightDir, lightDir);
	setUniformf(shader, 'light', [lightDir[0], lightDir[1], lightDir[2]]);
	camera.rot[1] += -0.05 * Math.sin(0.8 + t * 0.1);
	camera.use();
	setUniformMat(shader, 'world_s', shadowCam.world);
	setUniformMat(shader, 'proj_s', shadowCam.proj);
	texture.bind(0);
	shadowCam.fb.tex.bind(1);
	gl.generateMipmap(gl.TEXTURE_2D);
	camera.fb.clear([1,1,1,1]);
	scene.render();

	gauss1.use();
	screenFb.bind();
	tempFb.tex.bind(0);
	renderModel(plane);

	t += 1;
}

window.addEventListener('resize', resizeCallback);
function resizeCallback() {
	let w = window.innerWidth;
	let h = window.innerHeight;
	screenFb.width = gl.canvas.width = w;
	screenFb.height = gl.canvas.height = h;
	tempFb = createFramebuffer(window.innerWidth, window.innerHeight);
	camera.setFramebuffer(tempFb);
	screenFb.bind();

	mat4.identity(camera.proj);
	let yFov = 60 * (w>h ? 1 : h/w);
	mat4.perspective(camera.proj, yFov/180*Math.PI, w/h, 0.001, 50);
	setUniformMat(currentShader, 'proj', camera.proj);

	render();
};

window.addEventListener('load', async function() {
	await main();
	resizeCallback();
});

// vim: ts=2 sts=2 sw=2 noexpandtab
