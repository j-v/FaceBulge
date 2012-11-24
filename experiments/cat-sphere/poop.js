var camera,
    renderer,
    scene,
    material,
    mesh,
    texture,
    geometry;

function start() {
	renderer.render(scene, camera);
	animate(new Date().getTime()); 
}

function getVertex(x, y, planeGeom) {
	width = planeGeom.widthSegments + 1;
	
	index = width * y + x;
	return planeGeom.vertices[index];
}

function makeFuckedGridGeometry() // AKA Unikat geometry
{
	// make a point stick out of the mesh
	var size = 200;
	var divisions = 50;
	var geom= new THREE.PlaneGeometry(size, size, divisions, divisions);
	var v = getVertex(Math.round(1.23/2 * (divisions+1)), Math.round(.4*divisions), geom);
	v.z += 0.4 * size;
	v.y += 0.15 * size;
	console.log(geom.vertices.length);
	
	return geom;	
}

function euclid_distance(x1, y1, x2, y2)
{
	var x = x2 - x1;
	var y = y2 - y1;
	return Math.sqrt(x * x + y * y);
}

function makeBulgeGridGeometry(width, height, divWidth, 
		divHeight, bulgeCX, bulgeCY, bulgeRadius)
{
	var geom = new THREE.PlaneGeometry(width, height, divWidth, divHeight);
	// find square of points to consider
	var divCX = Math.round(((bulgeCX * 1.0) / width) * divWidth);
	var divCY = Math.round(((bulgeCY * 1.0) / height) * divHeight);
	var divX1 = Math.floor(((bulgeCX-bulgeRadius *1.0) / width) * divWidth);
	var divX2 = Math.ceil(((bulgeCX+bulgeRadius *1.0) / width) * divWidth);
	var divY1 = Math.floor(((bulgeCY-bulgeRadius *1.0) / height) * divHeight);
	var divY2 = Math.ceil(((bulgeCY+bulgeRadius *1.0) / height) * divHeight);

	var divSizeX = width/(divWidth*1.0);
	var divSizeY = height/(divHeight*1.0);
	for (var i=divX1; i<=divX2; i++)
	{
		for (var j=divY1; j<=divY2; j++)
		{
			if (euclid_distance(i*divSizeX, j*divSizeY, bulgeCX, bulgeCY) > bulgeRadius)
				continue;

			var x = i * divSizeX;
			var y = j * divSizeY;
			var x_diff = x - bulgeCX;
			var y_diff = y - bulgeCY;
			var z = Math.sqrt(bulgeRadius*bulgeRadius-x_diff*x_diff-y_diff*y_diff);

			var v = getVertex(i, j, geom);
			v.z += z;

		}
	}


	// add unikat
	var v = getVertex(Math.round(1.23/2 * (divWidth+1)), Math.round(.4*divWidth), geom);
	v.z += 0.4 * width;
	v.y += 0.15 * width;

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
        HEIGHT = 1000,
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	texture = THREE.ImageUtils.loadTexture('cat.gif', {}, function() {
            //scene.add(camera);
            start();
		}),

        //material = new THREE.MeshBasicMaterial({map: texture}),
        material = new THREE.MeshPhongMaterial({map: texture}),
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
		//geometry = makeFuckedGridGeometry(),
		geometry = makeBulgeGridGeometry(200, 200, 50, 50, 100, 100, 50),
        mesh = new THREE.Mesh(geometry, material);
        mesh.geometry.dynamic = true;
        //mesh = makeGridMesh(10, 10, 10, material);
    var pointLight = new THREE.PointLight(0xFFFFFF);

	mesh.position.x = 10;
	mesh.position.y = 25;

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
	camera.position.x = Math.abs(Math.sin(t/1000 + 1)*300 ) ;
	camera.position.y = 150;
	camera.position.z = Math.abs(Math.cos(t/1000 + 2)*300  );
	// you need to update lookAt every frame
  //geometry.vertices[50].z = Math.random() * 100;
  mesh.geometry.verticesNeedUpdate = true;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	// renderer automatically clears unless autoClear = false
	window.requestAnimationFrame(animate, renderer.domElement);
};
