#version 300 es

layout(location = 0)in vec3 c;
layout(location = 1)in vec3 n;
layout(location = 2)in vec2 t;

out mediump vec2 uv;

void main(void) {
	gl_Position = vec4(c, 1.0);
	uv = t;
}

