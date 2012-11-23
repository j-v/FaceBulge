var camera,
    renderer,
    scene;

function start() {
			renderer.render(scene, camera);
			animate(new Date().getTime()); 
}
function makeFuckedGridGeometry()
{
	// make a point stick out of the mesh
	var size = 300;
	var geom= new THREE.PlaneGeometry(size, size, 10, 10);
	var v = geom.vertices[50];
	v.z += 0.4 * size;
	v.y += 0.15 * size;
	return geom;	
}

// TODO didn't end up using this, so delete. but maybe find out what went wrong
function makeGridMesh(interval, width, height, material) 
{
	var geom = new THREE.Geometry();
	//vGrid = []; 
	// make vertices
	for (var i=0; i < width; i++) {
		//vGrid[i] = [];
		for (var j=0; j<height; j++) {
			var vertex = new THREE.Vector3(i*interval, j*interval, 0);
			//vGrid[i][j] = vertex;
			geom.vertices.push(vertex);
		}
	}
	// make faces
	for (var i=0; i < width - 1; i++) {
		for (var j=0; j < height - 1; j++) {
			// add two faces for each square
			// clockwise from top-left: A, B, C, D makes square
			vA = i * width + j;
			vB = vA + 1;
			vC = (i+1) * width + 1 +j;
			vD = (i+1) * width + j;
			geom.faces.push(new THREE.Face3(vA, vB, vC));
			geom.faces.push(new THREE.Face3(vA, vC, vD));
		}
	}
	geom.computeFaceNormals();

	mesh = new THREE.Mesh(geom, material);

	return mesh;
}

function loadScene() {
    var world = document.getElementById('world'),
        WIDTH = 1200,
        HEIGHT = 800,
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
        //radius = 75,
        //segments = 32,
        //rings = 32,
		//geometry = new THREE.SphereGeometry(
		//	radius,
		//	segments,
		//	rings),

		//geometry = new THREE.PlaneGeometry(100, 100, 10, 10),
        geometry = makeFuckedGridGeometry();
        mesh = new THREE.Mesh(geometry, material),
        //mesh = makeGridMesh(10, 10, 10, material);
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
	camera.position.x = Math.abs(Math.sin(t/1000)*300);
	camera.position.y = 150;
	camera.position.z = Math.abs(Math.cos(t/1000)*300);
	// you need to update lookAt every frame
	camera.lookAt(scene.position);
	// renderer automatically clears unless autoClear = false
	renderer.render(scene, camera);
	window.requestAnimationFrame(animate, renderer.domElement);
};
