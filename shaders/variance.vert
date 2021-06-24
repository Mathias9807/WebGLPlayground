#version 300 es

layout(location = 0)in vec3 c;
layout(location = 1)in vec3 n;
layout(location = 2)in vec2 t;

out highp vec4 v_w, v_p;

uniform highp mat4 proj, world, model;

void main(void) {
	v_w = world * model * vec4(c, 1.0);
	v_p = proj * v_w;
	gl_Position = v_p;
}

