#version 300 es

precision highp float;

out vec4 fragData;

in highp vec4 v_w, v_p;

void main() {
	fragData = vec4(-v_w.z, v_w.z*v_w.z, gl_FragCoord.z, 1.0);
}

