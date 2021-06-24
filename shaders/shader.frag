#version 300 es

precision mediump float;

in vec3 normal;
in mediump vec2 uv;
in vec4 v_ws, v_ps;
out vec4 fragColor;

uniform highp mat4 world;
uniform highp mat4 proj_s, world_s;
uniform vec3 light;

uniform sampler2D tex;
uniform highp sampler2D shadowTex;

void main() {
	vec4 texColor = texture(tex, uv);
	vec2 uv_s = (v_ps.xy + 1.0) / 2.0;
	vec4 depth_s = texture(shadowTex, uv_s, 2.5);
	float lit = 0.0;
	float t = -v_ws.z - 0.1;
	float e_x = depth_s.x;
	float e_x2 = depth_s.y;
	float variance = e_x2 - pow(e_x, 2.0);
	float mD = e_x - t;
	float mD_2 = mD * mD;
	float p = variance / (variance + mD_2);
	lit = max(p, t <= e_x ? 1.0 : 0.0);

	vec4 wNormal = world * vec4(normal, 0);
	vec4 light_dir = world * vec4(light, 0.0);
	float lightStrength = dot(normalize(wNormal.xyz), normalize(light_dir.xyz));
	lightStrength *= lit;
	fragColor = vec4(lightStrength * texColor.rgb, 1);
}

