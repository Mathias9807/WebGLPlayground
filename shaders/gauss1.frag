#version 300 es

precision mediump float;

in mediump vec2 uv;
out vec4 fragColor;

uniform sampler2D tex;

void main() {
	vec2 texel = 1.0 / vec2(textureSize(tex, 0));
	fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	int size = 10;
	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
			fragColor += texture(tex, uv + texel * vec2(float(-size/2 + j), float(-size/2 + i))) / 5.0;
		}
	}
}

