window.onload = function () {
    var canvas = document.getElementById('canvas');

    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    var sphereControl = {
        type: 'sphere',
        sphRadius: 75,
        volume: Math.PI * (75 ** 3),
        surfaceArea: 4 * Math.PI * 75 ** 2
    }

    var cubeControl = {
        type: 'cube',
        cubeHeight: 100,
        cubeLength: 100,
        cubeWidth: 100,
        volume: 1000000,
        surfaceArea: 2 * (100 * 100 + 100 * 100 + 100 * 100)
    }

    var trngControl = {
        type: 'triangulation',
        trngHeight: 100,
        trngLength: 100,
        trngWidth: 100,
        error: '' 
    }

    var cylinderControl = {
        type: 'cylinder',
        cylHeight: 200,
        cylRadius: 75,
        volume: Math.PI * 200 * 75 ** 2,
        surfaceArea: 2 * Math.PI * 75 * (200 + 75)
    }


    var gui = new dat.GUI();

    var text = { typeOfFigure: '' }
    var typeController = gui.add(text, 'typeOfFigure', ['box', 'cylinder', 'sphere', 'triangulation']);

    var guiBoxParams = {}
    var guiCylParams = {}
    var guiSphParams = {}
    var guiTrnParams = {}

    typeController.onChange(function (value) {
        var presentFigure = scene.getObjectByName('figure');
        scene.remove(presentFigure);
        switch (value) {
            case 'triangulation': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]); i--;
                }
                guiTrnParams.trngLength = gui.add(trngControl, 'trngLength', 0, 500);
                guiTrnParams.trngHeight = gui.add(trngControl, 'trngHeight', 0, 500);
                guiTrnParams.trngWidth = gui.add(trngControl, 'trngWidth', 0, 500);

                for (var item in guiTrnParams) {
                    guiTrnParams[item].onFinishChange(function () {
                        var presentFigure = scene.getObjectByName('figure');
                        scene.remove(presentFigure);
                        makeRequest(trngControl, 'triangulation');
                    })
                }
                break;
            }
            case 'box': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]); i--;
                }
                guiBoxParams.boxLength = gui.add(cubeControl, 'cubeLength', 0, 500);
                guiBoxParams.boxHeight = gui.add(cubeControl, 'cubeHeight', 0, 500);
                guiBoxParams.boxWidth = gui.add(cubeControl, 'cubeWidth', 0, 500);
                gui.add(cubeControl, 'volume');
                gui.add(cubeControl, 'surfaceArea');

                for (var item in guiBoxParams) {
                    guiBoxParams[item].onFinishChange(function () {
                        var presentFigure = scene.getObjectByName('figure');
                        scene.remove(presentFigure);
                        scene.add(new Cube);
                        makeRequest(cubeControl, 'getProps');
                    })
                }

                scene.add(new Cube);
                break;
            }
            case 'cylinder': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]); i--;
                }
                guiCylParams.cylRadius = gui.add(cylinderControl, 'cylRadius', 1, 500);
                guiCylParams.cylHeight = gui.add(cylinderControl, 'cylHeight', 0, 500);
                gui.add(cylinderControl, 'volume');
                gui.add(cylinderControl, 'surfaceArea');

                for (var item in guiCylParams) {
                    guiCylParams[item].onFinishChange(function () {
                        var presentFigure = scene.getObjectByName('figure');
                        scene.remove(presentFigure);
                        scene.add(new Cylinder);
                        makeRequest(cylinderControl, 'getProps');
                    })
                }

                scene.add(new Cylinder);
                break;
            }
            case 'sphere': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]); i--;
                }
                guiSphParams.sphRadius = gui.add(sphereControl, 'sphRadius', 0, 500);
                gui.add(sphereControl, 'volume');
                gui.add(sphereControl, 'surfaceArea');

                guiSphParams.sphRadius.onFinishChange(function () {
                    var presentFigure = scene.getObjectByName('figure');
                    scene.remove(presentFigure);
                    scene.add(new Sphere);
                    makeRequest(sphereControl, 'getProps');
                })

                scene.add(new Sphere);
                break;
            }
        }
    });

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setClearColor(0x000000);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(-200, 200, 500);
    camera.lookAt(scene.position)


    function makeRequest(control, adress) {
        fetch('http://localhost:3000/' + adress, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(control),
            responseType: 'json',
        }).then((res) => {
            res.json().then((data) => {
                switch (data.type) {
                    case 'props': {
                        control.volume = data.volume;
                        control.surfaceArea = data.surfaceArea;
                        gui.remove(gui.__controllers[gui.__controllers.length - 1])
                        gui.remove(gui.__controllers[gui.__controllers.length - 1])
                        gui.add(control, 'volume');
                        gui.add(control, 'surfaceArea');
                        break;
                    }
                    case 'triangulation': {
                        if (gui.__controllers.length == 5) {
                            gui.remove(gui.__controllers[gui.__controllers.length - 1])        
                        }
                        scene.add(new Triangulation(data.vertices));
                        break;
                    }
                }
            });
        }).catch(() => {
            if (control.type === 'triangulation') {
                control.error = 'connection error';
                if (gui.__controllers.length == 5) {
                    gui.remove(gui.__controllers[gui.__controllers.length - 1])
                    gui.add(control, 'error');
                } else {
                    gui.add(control, 'error');
                }
            } else {
                control.volume = 'connection error';
                control.surfaceArea = 'connection error';
                gui.remove(gui.__controllers[gui.__controllers.length - 1])
                gui.remove(gui.__controllers[gui.__controllers.length - 1])
                gui.add(control, 'volume');
                gui.add(control, 'surfaceArea');
            }
        })
    }

    function Cube() {
        var cubeGeometry = new THREE.CubeGeometry(cubeControl.cubeLength, cubeControl.cubeHeight, cubeControl.cubeWidth, 4, 4, 4);
        var cubeTexture = new THREE.MeshNormalMaterial({/*wireframe: true*/ });
        var cube = new THREE.Mesh(cubeGeometry, cubeTexture);
        cube.name = 'figure'
        return cube;
    }

    function Cylinder() {
        var cylinderGeometry = new THREE.CylinderGeometry(cylinderControl.cylRadius, cylinderControl.cylRadius, cylinderControl.cylHeight, 40);
        var cylinderTexture = new THREE.MeshNormalMaterial();
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderTexture);
        cylinder.rotation.z += Math.PI / 2;
        cylinder.rotation.y += Math.PI / 6;
        cylinder.name = 'figure'
        return cylinder;
    }

    function Sphere() {
        var sphereGeometry = new THREE.SphereGeometry(sphereControl.sphRadius, 20, 20);
        for (let i = 0; i < sphereGeometry.faces.length; i++) {
            sphereGeometry.faces[i].color.setRGB(Math.random(), Math.random(), Math.random())
        }
        var sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true, vertexColors: THREE.FaceColors })
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.name = 'figure'
        return sphere;
    }

    function Triangulation(data) {
        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array(data);
        geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.name = 'figure'
        return mesh;
    }
    function loop() {
        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
}