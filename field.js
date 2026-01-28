const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");
if (!gl) alert("WebGL neni podporované");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0,0,canvas.width,canvas.height);
}
window.addEventListener("resize", resize);
resize();

// Stav poľa zo servera
let state = { C:0.5, T:0.5, S:0.3, E:0.6 };

// Interakčný filter (myš)
let interactiveT = 0.0;
let interactiveFactor = 0.0;

canvas.addEventListener("mousemove", (e) => {
  // horizontálna pozícia myši [0,1]
  let normX = e.clientX / canvas.width;
  interactiveT = normX;
  // vertikálna pozícia myši ako jemný filter
  let normY = e.clientY / canvas.height;
  interactiveFactor = 1.0 - normY;
});

// Poll server pre stav
async function fetchState() {
  try {
    const res = await fetch("field_state.json?"+Date.now());
    const data = await res.json();
    state = data.phi;
  } catch(e){}
}
setInterval(fetchState, 300);

// Shader pomocné funkcie
async function compileShader(type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

async function initShaders() {
  const vSrc = await (await fetch('shaders/vertex.glsl')).text();
  const fSrc = await (await fetch('shaders/fragment.glsl')).text();

  const vShader = await compileShader(gl.VERTEX_SHADER, vSrc);
  const fShader = await compileShader(gl.FRAGMENT_SHADER, fSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
}

function main() {
  initShaders().then(program => {
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const stateLoc = gl.getUniformLocation(program, "u_state");
    const interLoc = gl.getUniformLocation(program, "u_inter");

    function render() {
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resLoc, canvas.width, canvas.height);

      // kombinujeme stav simulácie so vstupom myši
      let combinedT = (state.T * 0.6) + (interactiveT * 0.4);
      let combinedC = state.C * (0.7 + interactiveFactor * 0.3);

      // u_state = (C, T_modified, S, E)
      gl.uniform4f(stateLoc, combinedC, combinedT, state.S, state.E);

      // uniform pre filter intenzity myši
      gl.uniform1f(interLoc, interactiveFactor);

      // draw full-screen quad
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    }
    render();
  });
}

main();
