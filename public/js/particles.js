//constants and variables needed
//Using v16.8 of tween b/c it doesnt use JS modules or use AMD version of Tween?
let t = THREE;

let renderer, scene, camera, light, clock;
let params = {
    h: 1,
    s: 1,
    l: 1
}

var bloomParams = {
    exposure: 1,
    bloomStrength: .5,
    bloomThreshold: 0,
    bloomRadius: 0,
};
var color = new THREE.Color();

const PI = Math.PI; //three uses radians for rotations

function getParticleSystem(){
        //geomerty to render points for particles
        var particleGeo = new t.Geometry();
        var particleMaterial = new t.PointsMaterial({
            color: 0xffffff, 
            size: 1,
            map: new t.TextureLoader().load('./assets/particle.jpg'),
            transparent: true,
            blending: t.AdditiveBlending,
            depthWrite: false
    
        });
    
        for(let i =0; i< 2500; i++){
            let point = new t.Vector3(
                (Math.random() -.5) * 100, 
                (Math.random() -.5) * 100, 
                (Math.random() -.5) * 100
            );
            particleGeo.vertices.push(point);
        }
    
        return new t.Points(particleGeo, particleMaterial);
};

function getParticlesFromGeometry(){
    let s = new t.SphereGeometry(10 ,32,32);
    var particleMaterial = new t.PointsMaterial({
        color: 0xffffff, 
        size: .5,
        map: new t.TextureLoader().load('./assets/particle.jpg'),
        transparent: true,
        blending: t.AdditiveBlending,
        depthWrite: false

    });
    return new t.Points(s, particleMaterial);
}

function animate(controls, composer){
    let elapsed = clock.getElapsedTime();
    // scene.getObjectByName('particles').geometry.vertices.forEach(i =>{
    //     i.x += Math.cos(elapsed * 0.2);

    // });
    scene.getObjectByName('particles').rotation.y += .01;
    //scene.getObjectByName('particles').geometry.verticesNeedUpdate = true;

    scene.getObjectByName('star').material.color = color.setHSL(params.h,params.s,params.l);
    scene.getObjectByName('star').material.needsUpdate = true;

    composer.passes[1].strength = bloomParams.bloomStrength;
    composer.passes[1].threshold = bloomParams.bloomThreshold;
    composer.passes[1].radius = bloomParams.bloomRadius;
    controls.update();
    requestAnimationFrame(() => animate(controls, composer));
    composer.render();
}


(function (){
    console.log("THREE.JS APP BEGIN");
    //the scnee wher all objects live
    
    scene = new t.Scene();
    //scene.fog = new t.FogExp2( 0xffffff, .01);
    // Field of view, aspect ratio, near, far
    // perspective camera makes objects smaller and closer
    camera = new t.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0,0,10);
    camera.lookAt(0,0,0);

    renderer = new t.WebGLRenderer();
    //renderer.shadowMap.enabled = true; //render shadows
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x7a7a7a);
    document.body.appendChild(renderer.domElement);

    let composer = new t.EffectComposer(renderer);
    let renderpass = new t.RenderPass(scene, camera);
    composer.addPass(renderpass);
    let bloom = new t.UnrealBloomPass( new t.Vector2( window.innerWidth, window.innerHeight ), 1, .5, 0);
    bloom.renderToScreen = true;
    composer.addPass(bloom);

    //allows for mouse dragging - need to set the camera position for it to work
    var controls = new t.OrbitControls(camera, renderer.domElement);

    //use the three clock object
    clock = new t.Clock();

    let s = new t.Mesh(
        new t.SphereGeometry(5, 24, 24), 
        new t.MeshBasicMaterial({
        flatShading: true,
		color: 0xffffff,
		reflectivity: 0.95,
		combine: t.MixOperation
        })
    );
    s.name = "star";

    var gui = new dat.GUI({name: 'My GUI'});
    let colorSelect = gui.addFolder("Color Controls");
    colorSelect.add(params, "h" , 0, 1);
    colorSelect.add(params, "s" , 0, 1);
    colorSelect.add(params, "l" , 0, 1);
    let editBloom = gui.addFolder("Bloom Settings");
    editBloom.add(bloomParams,"exposure", 0,2);
    editBloom.add(bloomParams, "bloomStrength", 0, 5);
    editBloom.add(bloomParams, "bloomRadius", 0,1);
    editBloom.add(bloomParams, "bloomThreshold", 0, 1);

    scene.add(s);

    let particleSys = getParticlesFromGeometry();
    particleSys.name = "particles";
    scene.add(particleSys);
    animate(controls, composer);

})();