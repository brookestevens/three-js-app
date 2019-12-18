var gui = new dat.GUI({name: 'My GUI'});

let cameraControls = gui.addFolder("Camera Controls");
cameraControls.add(cameraZposition.position, "z" , -100,100);
cameraControls.add(cameraZrotation.rotation, "z" , -Math.PI/2, Math.PI/2);
cameraControls.add(cameraYrotation.rotation, "y", -Math.PI, Math.PI);
cameraControls.add(cameraXrotation.rotation, "x", -Math.PI/2, Math.PI/2);
//gui.add(light, "penumbra", 0, 1); //for the spotlight

let guiB = gui.addFolder('Lighting Controls');
guiB.add(light, "intensity", 0, 10);
guiB.add(light.position, "x", 0, 20);
guiB.add(light.position, "y", 0, 20);
guiB.add(light.position, "z", 0, 20);