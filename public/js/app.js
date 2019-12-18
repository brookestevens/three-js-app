//constants and variables needed
//Using v16.8 of tween b/c it doesnt use JS modules or use AMD version of Tween?
let t = THREE;
let Tween = TWEEN;

let renderer, scene, camera, light, clock;
let cameraZposition, cameraYposition, cameraYrotation, cameraXrotation, cameraZrotation;

const PI = Math.PI; //three uses radians for rotations
var box, plane, sphere, boxGrid; //you can log global vars and functions!!

//Mesh basic material doesnt get affected by lighting
//function to get a new box object
function getBox(w, h, d, c){
    //3D mesh is created from geometry and material params
    return new t.Mesh(
        new t.BoxGeometry(w,h,d), 
        new t.MeshPhongMaterial({color: c})
    );
}

//get a sphere
function getSphere(radius, c = 0xffffff){
    return new t.Mesh(
        new t.SphereGeometry(radius, 24, 24), 
        new t.MeshBasicMaterial({color: c})
    );
}

//return a new plane with color and size
function getPlane(width,color){
    return new t.Mesh(
        new t.PlaneGeometry(width,width),
        new t.MeshPhongMaterial({color: color, side: t.DoubleSide })
    );
}

function getColor(row){
    return row * 0x00cdef;
}

function getBoxGrid(amount, seperation){
    var group = new t.Group(); //organizing groups together (like a div)
    for(let i =0; i< amount; i++){
        for(let j = 0; j< amount; j++){
            let obj = getBox(1,3,1,getColor(j));
            obj.position.set(i*seperation, obj.geometry.parameters.height/2, j*seperation);
            obj.castShadow = true;
            group.add(obj);   
        }    
    }
    group.position.set(-(seperation *(--amount))/2, 0, -(seperation * (--amount))/2);
    return group;
}


//loop and render the animations
//requestAnimationFrame will recursively call the animate function to continuously update

function animate(controls){
    //do stuff here
    //use getObjectByName() to select objects (type Object3D) in the scene
    //Object3D.traverse() is a callback affects the children (like foreach but for objects)

    let elapsed = clock.getElapsedTime();
    Tween.update();

    scene.getObjectByName("myGrid").children.forEach( (child, i) => {
        child.scale.y = Math.abs(Math.sin(elapsed + i))+ .001;
        child.position.y = child.scale.y /2;
    });

    controls.update();
    requestAnimationFrame(() => animate(controls));
    renderer.render(scene, camera);
}


(function (){
    console.log("THREE.JS APP BEGIN");
    //the scnee wher all objects live
    
    scene = new t.Scene();
    scene.fog = new t.FogExp2( 0xffffff, .01);
    // Field of view, aspect ratio, near, far
    // perspective camera makes objects smaller and closer
    camera = new t.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0,0,0);
    camera.lookAt(0,0,0);
    //Animation rigs make animation easier to manage - order of adding groups matter
    cameraZposition = new t.Group();
    cameraYposition = new t.Group();

    cameraXrotation = new t.Group();
    cameraYrotation = new t.Group();
    cameraZrotation = new t.Group();
    
    cameraZrotation.add(camera);
    cameraYposition.add(cameraZrotation);
    cameraZposition.add(cameraYposition);
    cameraXrotation.add(cameraZposition);
    cameraYrotation.add(cameraXrotation);
    scene.add(cameraYrotation);

    cameraXrotation.rotation.x = -PI/2;
    cameraYposition.position.y = 1;
    cameraZposition.position.z = 100;

    //initialize tween -- used for animations
    new Tween.Tween({val:100}).to({val: 0}, 10000).onUpdate(function(){
        cameraZposition.position.z = this.val;
    }).start();

    new Tween.Tween({val: -PI/2}).to({val: 0}, 4000).delay(1000).easing(Tween.Easing.Quadratic.InOut)
    .onUpdate(function (){
        cameraXrotation.rotation.x = this.val;
    }).start();

    new Tween.Tween({val: 0}).to({val: PI/2}, 3000).delay(1000).easing(Tween.Easing.Quadratic.InOut)
    .onUpdate(function (){
        cameraYrotation.rotation.y = this.val;
    }).start();

    //orthographic camera has no perspective effects -> like technical drawing
    //camera = new t.OrthographicCamera(-15,15,15, -15, 1,1000);
    //camera.position.set(1,2,5);
    //use the GPU not CPU with this renderer
    renderer = new t.WebGLRenderer();
    renderer.shadowMap.enabled = true; //render shadows
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x7a7a7a);

    //allows for mouse dragging - need to set the camera position for it to work
    var controls = new t.OrbitControls(camera, renderer.domElement);

    //use the three clock object
    clock = new t.Clock();


    //different types of light (point light)
    light = new t.PointLight(0xffffff, 2);

    //spot light example
    //light = new t.SpotLight(0xffffff, 2);

    //Directional Light example - all shadows are parallel to each other
    //light = new t.DirectionalLight(0xffffff, 2);

    //Ambient Lights cast no shadows, illuminates all items in the scene
    //light = new t.AmbientLight(0x0000ff, 2);

    //Rect Area Lights are 2D light sources, which is more realisitc than the others
    
    //light = new t.AmbientLight();
    
    light.position.y = 4;
    light.castShadow = true;
    light.shadow.bias = .001; //make shadows look better
    light.shadow.mapSize.width = 2048; //making this too big will hurt performance
    light.shadow.mapSize.height = 2048;

    plane = getPlane(100, 0x7a7a7a);
    sphere = getSphere(.1, 0xffffff);
    boxGrid = getBoxGrid(20,2.5);
    boxGrid.name = "myGrid";
    plane.rotation.x = PI/2;
    plane.name = "myPlane"; //set name to select it 
    plane.receiveShadow = true; //tell object to reflect a shadow
    scene.add(plane);
    scene.add(light);
    scene.add(boxGrid);
    light.add(sphere);

    document.body.appendChild(renderer.domElement);
    animate(controls);

})();