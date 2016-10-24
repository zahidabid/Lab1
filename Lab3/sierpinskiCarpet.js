"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

var delay = 100;
var direction = false;

var zoom = 100;

var points = [];

var NumTimesToSubdivide = 3;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
        vec2(-1, -1),
        vec2(-1, 1),
        vec2(1, 1),
        vec2(1, -1)
    ];

    divideSquare(vertices[0], vertices[1], vertices[2], vertices[3],
        NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    thetaLoc = gl.getUniformLocation( program, "theta" );

    // Initialize event handlers

    // slider used to zoom in and out of window
    document.getElementById("slide").onchange = function () {
        zoom = event.srcElement.value;
    };


    // rotaion on/off button for the carpet
    document.getElementById("Direction").onclick = function () {
        direction = !direction;
    };

    // get number of recusions from the users keyboard
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch(key) {

            case '0':
                NumTimesToSubdivide = 0;
                break;

            case '1':
                NumTimesToSubdivide = 1;
                break;

            case '2':
                NumTimesToSubdivide = 2;
                break;

            case '3':
                NumTimesToSubdivide = 3;
                break;

            case '4':
                NumTimesToSubdivide = 4;
                break;

            case '5':
                NumTimesToSubdivide = 5;
                break;

            case '6':
                NumTimesToSubdivide = 6;
                break;

            case '7':
                NumTimesToSubdivide = 7;
                break;

            case '8':
                NumTimesToSubdivide = 8;
                break;

            case '9':
                NumTimesToSubdivide = 9;
                break;

        }
    };


    // changes the window size
    window.onresize = function(){

        var min = innerWidth;

        if(innerWidth < min){
            min = innerHeight;
        }

        if( min < canvas.width || min < canvas.height) {
            gl.viewport(0,canvas.height-min, min, min);
        }

    };

    render();
};


function square(a, b, c, d) {
    points.push(a, b, c, d);

}


function divideSquare(a, b, c, d, count) {


    // get 1/3 of the diagnals to get the four
    // corners of of rectangle
    var ab = mix(a,b,1/3);
    var ac = mix(a, c, 1 / 3);
    var ad = mix(a, d, 1 / 3);

    var ba = mix(b, a, 1 / 3);
    var bc = mix(b, c, 1 / 3);
    var bd = mix(b, d, 1 / 3);

    var ca = mix(c, a, 1 / 3);
    var cb = mix(c, b, 1 / 3);
    var cd = mix(c, d, 1 / 3);

    var da = mix(d, a, 1 / 3);
    var db = mix(d, b, 1 / 3);
    var dc = mix(d, c, 1 / 3);


    if (count != 0) {
        square(ac, bd, ca, db);
    }

    if (count > 1) {

        --count;

        // create 8 new squares
        divideSquare(a, ab, ac, ad, count);
        divideSquare(ab, ba, bd, ac, count);
        divideSquare(ba, b, bc, bd, count);
        divideSquare(bd, bc, cb, ca, count);
        divideSquare(ca, cb, c, cd, count);
        divideSquare(db, ca, cd, dc, count);
        divideSquare(da, db, dc, d, count);
        divideSquare(ad, ac, db, da, count);


    }


}

function render() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += (direction ? true : false);
    gl.uniform1f(thetaLoc, theta);

    var i;
    for(i=0; i<points.length; i+=4)
    {
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    }


    setTimeout(
        function (){requestAnimFrame(render);}, delay
    );

}
