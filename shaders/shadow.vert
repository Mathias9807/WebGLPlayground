#version 300 es

layout(location = 0)in vec3 c;
layout(location = 1)in vec3 n;
layout(location = 2)in vec2 t;

uniform highp mat4 proj, world, model;

void main(void) {
	gl_Position = proj * world * model * vec4(c, 1.0);
}

