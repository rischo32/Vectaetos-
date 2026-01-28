precision mediump float;

uniform vec2 u_resolution;
uniform vec4 u_state;  // C, T, S, E
uniform float u_inter; // interakčný faktor

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  float C = u_state.x;
  float T = u_state.y;
  float S = u_state.z;
  float E = u_state.w;

  // kombinuj farbu s interaktívnym faktorom
  vec3 cold = vec3(0.1, 0.2, 0.5);  // pokojná modrá
  vec3 warm = vec3(0.5, 0.2, 0.1);  // napätie ako teplá

  vec3 base = mix(cold, warm, T);

  // jemný filter podľa interaktivity
  float factor = 0.3 + u_inter * 0.7;

  // pulz (mierna vlna)
  float pulse = sin((uv.x + uv.y + C*6.28) * 2.0);

  vec3 color = base * (0.7 + 0.3*pulse) * factor;

  // entropia tlmí intenzitu
  color *= (1.0 - S);

  gl_FragColor = vec4(color, 1.0);
}
