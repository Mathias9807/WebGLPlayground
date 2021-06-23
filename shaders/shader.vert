#version 300 es

layout(location = 0)in vec3 c;
layout(location = 1)in vec3 n;
layout(location = 2)in vec2 t;

out vec3 normal;
out mediump vec2 uv;
out vec4 v_ws, v_ps;

uniform highp mat4 proj, world, model;
uniform highp mat4 proj_s, world_s;

void main(void) {
	gl_Position = proj * world * model * vec4(c, 1.0);
	v_ws = world_s * model * vec4(c, 1.0);
	v_ps = proj_s * v_ws;
	normal = normalize(n);
	uv = t;
}

