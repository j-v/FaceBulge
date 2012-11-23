var camera,
    renderer,
    scene;

function start() {
			renderer.render(scene, camera);
			animate(new Date().getTime()); 
}

function loadScene() {
    var world = document.getElementById('world'),
        WIDTH = 1200,
        HEIGHT = 500,
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	var texture = THREE.ImageUtils.loadTexture('cat.gif', {}, function() {
            //scene.add(camera);
            start();
		}),

        material = new THREE.MeshBasicMaterial({map: texture}),
        // material = new THREE.MeshPhongMaterial({color: 0xCC0000});
        //geometry = new THREE.PlaneGeometry(100, 100),
        radius = 75,
        segments = 32,
        rings = 32,
		geometry = new THREE.SphereGeometry(
			radius,
			segments,
			rings),

        mesh = new THREE.Mesh(geometry, material),
        pointLight = new THREE.PointLight(0xFFFFFF);

    camera.position.z = 300;    
    renderer.setSize(WIDTH, HEIGHT);
    scene.add(mesh);
    world.appendChild(renderer.domElement);
    pointLight.position.x = 50;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight); 
}

function animate(t) {
	// spin the camera in a circle
	camera.position.x = Math.sin(t/1000)*300;
	camera.position.y = 150;
	camera.position.z = Math.cos(t/1000)*300;
	// you need to update lookAt every frame
	camera.lookAt(scene.position);
	// renderer automatically clears unless autoClear = false
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate, renderer.domElement);
};
