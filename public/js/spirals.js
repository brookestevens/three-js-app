//constants and variables needed
let t = THREE;

let renderer, scene, camera, light, clock;
let cameraZposition, cameraYposition, cameraXposition;

const PI = Math.PI; //three uses radians for rotations

var circles, outerCircles;

//polar to coordinate => ( radius * cos(theta), radius * sin(theta))
function getSpiralLine(){
    var spline = new t.Geometry();
    for(let i =0; i< 500; i++){
        let point = new t.Vector3(5*Math.cos(PI + i), 5*Math.sin(PI + i), i);
        spline.vertices.push(point);
    }
    return new t.Line(
        spline,
        new t.LineBasicMaterial({color: 0x00ff00})
    );
}

//get a spiral of circles
function getSpiralCircles(radius){
    var circles = new t.Group(); //group for circels
    for(let i=0; i<150; i++){
        let c = getSphere(.5, getColor(i));
        c.position.set(radius*Math.cos(PI + i), radius*Math.sin(PI + i), i);
        circles.add(c);
    }
    return circles;
}

//get a sphere
//set the transparent flag to true and set opacity for transparency
function getSphere(radius, c = 0xffffff){
    return new t.Mesh(
        new t.SphereGeometry(radius, 24, 24), 
        new t.MeshBasicMaterial({color: c, transparent: true, opacity: .8})
    );
}

function getColor(row){
    return row * 0x00cdef;
}


//loop and render the animations
//requestAnimationFrame will recursively call the animate function to continuously update

function animate(controls){
    //use getObjectByName() to select objects (type Object3D) in the scene
    //Object3D.traverse() is a callback affects the children (like foreach but for objects)

    let elapsed = clock.getElapsedTime();

    scene.getObjectByName("spiralCircles").children.forEach( (el, i) => {
        el.scale.x = el.scale.y = el.scale.z = Math.sin(elapsed + (i+.001))*5;
    });

    scene.getObjectByName("spiralCircles").rotation.z += .03;

    scene.getObjectByName("outerCircles").children.forEach( (el, i) => {
        el.position.x += Math.sin(elapsed + (i * 0.2)) * 5;
        el.position.y += Math.cos(elapsed + (i * 0.2)) * 5;
    });
    controls.update();

    setTimeout( function() {
        requestAnimationFrame(() => animate(controls));
    }, 1000 / 15 );

    renderer.render(scene, camera);
}


(function (){
    scene = new t.Scene();
    //scene.fog = new t.FogExp2( 0xffffff, .2);
    // Field of view, aspect ratio, near, far
    // perspective camera makes objects smaller and closer
    camera = new t.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0,0,200);
    camera.lookAt(0,0,0);

    //Animation rigs make animation easier to manage - order of adding groups matter
    cameraZposition = new t.Group();
    cameraYposition = new t.Group();
    cameraXposition = new t.Group();
    cameraZposition.add(camera);
    cameraXposition.add(cameraZposition);
    cameraYposition.add(cameraXposition);
    scene.add(cameraYposition);

    //Point light
    light = new t.PointLight(0xffffff, 2);
    light.position.y = 5;

    //use the GPU not CPU with this renderer
    renderer = new t.WebGLRenderer();
    renderer.shadowMap.enabled = true; //render shadows
    renderer.setSize(window.innerWidth, window.innerHeight);

    //allows for mouse dragging - need to set the camera position for it to work
    var controls = new t.OrbitControls(camera, renderer.domElement);

    //use the three clock object
    clock = new t.Clock();
    circles = getSpiralCircles(10);
    circles.name = "spiralCircles";
    outerCircles = getSpiralCircles(20);
    outerCircles.name = "outerCircles";
    scene.add(outerCircles);
    scene.add(circles);
    scene.add(light);

    document.body.appendChild(renderer.domElement);
    animate(controls);

})();

