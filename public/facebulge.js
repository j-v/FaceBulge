function start() {
	renderer.render(scene, camera);
	animate(new Date().getTime()); 
}

function getVertex(x, y, planeGeom) {
	width = planeGeom.widthSegments + 1;
	
	index = width * y + x;
	return planeGeom.vertices[index];
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
			v.z += z * 0.5;

		}
	}

	return geom;
}


function loadScene() {
    var world = document.getElementById('world'),
        WIDTH = 1200,
        HEIGHT = 1000,
        VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
    
	// bulge grid parameters
	var face = face_info.faces[0]; // only use 1st face for now
	var img_height = face_info.height;
	var img_width = face_info.width;
	var grid_width = 50;
	var grid_height = 50;
	var face_radius = 0.8 * (face.width+face.height)/2 ;
	var face_cX = face.x + face.width/2;
	var face_cY = face.y + face.height/2;
	
	renderer = new THREE.WebGLRenderer();
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene = new THREE.Scene();
	texture = THREE.ImageUtils.loadTexture(photo_path, {}, function() {
			// need to wait until texture is loaded to display stuff
            start();
		}),

        material = new THREE.MeshBasicMaterial({map: texture}),
		geometry = makeBulgeGridGeometry(img_width, 
				img_height,
				grid_width,
				grid_height,
				face_cX,
				face_cY,
				face_radius),
        mesh = new THREE.Mesh(geometry, material);
	mesh.geometry.dynamic = true;
    var pointLight = new THREE.PointLight(0xFFFFFF);

	mesh.position.x = 10;
	mesh.position.y = 25;

    camera.position.z = Math.max(img_height, img_width);    
    renderer.setSize(WIDTH, HEIGHT);
    scene.add(mesh);
    world.appendChild(renderer.domElement);
    pointLight.position.x = 50;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    scene.add(pointLight); 
}

function animate(t) {
	var img_height = face_info.height;
	var img_width = face_info.width;
	var multiplier = Math.max(img_height, img_width) * 2;    
	// spin the camera in a circle
	//camera.position.x = Math.abs(Math.sin(t/10000 + 1)*multiplier ) ;
	camera.position.x = Math.abs(Math.sin(t/5000)*multiplier ) ;
	camera.position.y = 150;
	//camera.position.z = Math.abs(Math.cos(t/10000 + 2)*multiplier  );
	camera.position.z = Math.abs(Math.cos(t/5000 )*multiplier  );
	// you need to update lookAt every frame
    //mesh.geometry.verticesNeedUpdate = true;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	// renderer automatically clears unless autoClear = false
	window.requestAnimationFrame(animate, renderer.domElement);
};
