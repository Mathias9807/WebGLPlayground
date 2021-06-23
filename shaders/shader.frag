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
uniform highp sampler2DShadow shadowTex;

void main() {
	vec4 texColor = texture(tex, uv);
	vec2 uv_s = (v_ps.xy + 1.0) / 2.0;
	// vec4 depth_s = texture(shadowTex, uv_s);
	float lit = 0.0;
	// if (depth_s.r + 0.001 < (v_ps.z+1.0)/2.0) lit = 0.0;
	// lit = texture(shadowTex, vec3(uv_s, (v_ps.z+1.0)/2.0+0.001));
	float d = 0.008;
	lit += texture(shadowTex, vec3(uv_s+d*vec2( 1,1), (v_ps.z+1.0)/2.0+0.001));
	lit += texture(shadowTex, vec3(uv_s+d*vec2(-1,1), (v_ps.z+1.0)/2.0+0.001));
	lit += texture(shadowTex, vec3(uv_s+d*vec2(1,-1), (v_ps.z+1.0)/2.0+0.001));
	lit += texture(shadowTex, vec3(uv_s+d*vec2(-1,-1), (v_ps.z+1.0)/2.0+0.001));
	lit /= 4.0;

	vec4 wNormal = world * vec4(normal, 0);
	vec4 light_dir = world * vec4(light, 0.0);
	float lightStrength = dot(normalize(wNormal.xyz), normalize(light_dir.xyz));
	lightStrength *= lit;
	fragColor = vec4(lightStrength * texColor.rgb, 1);
}

