//constants and variables needed
//Using v16.8 of tween b/c it doesnt use JS modules or use AMD version of Tween?
let t = THREE;

let renderer, scene, camera, light, fft, mediaElement;

const PI = Math.PI; //three uses radians for rotations

function getParticleSystem(){
        //geomerty to render points for particles
        var particleGeo = new t.Geometry();
        var particleMaterial = new t.PointsMaterial({
            color: 0xffffff, 
            size: 2,
            map: new t.TextureLoader().load('./assets/particle.jpg'),
            transparent: true,
            blending: t.AdditiveBlending,
            depthWrite: false
    
        });
    
        for(let i =0; i< 2000; i++){
            let point = new t.Vector3(
                (Math.random() -.5) * 100,
                0, 
                (Math.random() -.5) * 100,
            );
            particleGeo.vertices.push(point);
        }
    
        return new t.Points(particleGeo, particleMaterial);
};

function getParticlesFromGeometry(){
    let s = new t.SphereGeometry(12,64,64);
    var particleMaterial = new t.PointsMaterial({
        color: 0xaaccff, 
        size: .5,
        map: new t.TextureLoader().load('./assets/particle.jpg'),
        transparent: true,
        blending: t.AdditiveBlending,
        depthWrite: false

    });
    return new t.Points(s, particleMaterial);
}

function getAudioAnalyzer(fftSize){
    var listener = new t.AudioListener();
    var audio = new t.Audio( listener );
    mediaElement = new Audio( './assets/song.mp3' );
    mediaElement.loop = true;
    audio.setMediaElementSource( mediaElement );
    return new t.AudioAnalyser( audio, fftSize );
}

function animate(controls){
    let spectrum = fft.getFrequencyData();
    //scene.getObjectByName('particles').rotation.y += .01;
    scene.getObjectByName('particles').geometry.vertices.forEach( (el, i) => {
        let s = spectrum[i%64] + .1 ;
        let o = el.y;
        el.y = o + s/100; 
    });
    scene.getObjectByName('particles').geometry.verticesNeedUpdate = true;
    scene.getObjectByName('particles').material.needsUpdate = true;
    controls.update();
    requestAnimationFrame(() => animate(controls));
    renderer.render(scene, camera);
}

(function (){
    console.log("THREE.JS APP BEGIN");
    //the scnee wher all objects live
    
    scene = new t.Scene();
    //scene.fog = new t.FogExp2( 0xffffff, .01);
    // Field of view, aspect ratio, near, far
    // perspective camera makes objects smaller and closer
    camera = new t.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(0,0,300);
    scene.position.set(0,-100,0);

    renderer = new t.WebGLRenderer();
    //renderer.shadowMap.enabled = true; //render shadows
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.setClearColor(0x7a7a7a);
    document.body.appendChild(renderer.domElement);
    var controls = new t.OrbitControls(camera, renderer.domElement);

    fft = getAudioAnalyzer(128);

    let particleSys = getParticlesFromGeometry();

    particleSys.name = "particles";
    scene.add(particleSys);
    animate(controls);

})();

//Event Listeners
window.addEventListener('keydown', (e) => {
    if(e.code === 'KeyP'){
        mediaElement.play();
    }
    if(e.code === "KeyO"){
        mediaElement.pause();
    }
});