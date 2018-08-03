window.onload = function () {
    var canvas = document.getElementById('canvas');

    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);

    var sphereControl = {
        sphRadius: 75,
        volume: Math.PI * (75 ** 3),
        surfaceArea: 4 * Math.PI * 75 ** 2
    }

    var cubeControl = {
        cubeHeight: 100,
        cubeLength: 100,
        cubeWidth: 100,
        volume: 1000000,
        surfaceArea: 2 * (100 * 100 + 100 * 100 + 100 * 100)
    }

    var cylinderControl = {
        cylHeight: 200,
        cylRadius: 75,
        volume: Math.PI * 200 * 75 ** 2,
        surfaceArea: 2 * Math.PI * 75 * (200 + 75)
    }

    var text = {
        typeOfFigure: ''
    }

    var gui = new dat.GUI();
    var typeController = gui.add(text, 'typeOfFigure', ['box', 'cylinder', 'sphere']);

    var guiBoxParams = {}
    var guiCylParams = {}
    var guiSphParams = {}


    typeController.onChange(function (value) {
        var presentFigure = scene.getObjectByName('figure');
        scene.remove(presentFigure);
        switch (value) {
            case 'box': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]);
                    i--;
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

                        cubeControl.volume = cubeControl.cubeHeight * cubeControl.cubeLength * cubeControl.cubeWidth;
                        cubeControl.surfaceArea = 2 * (cubeControl.cubeHeight * cubeControl.cubeLength +
                            cubeControl.cubeHeight * cubeControl.cubeWidth + cubeControl.cubeLength * cubeControl.cubeWidth);

                        gui.remove(gui.__controllers[gui.__controllers.length - 1])
                        gui.remove(gui.__controllers[gui.__controllers.length - 1])

                        gui.add(cubeControl, 'volume');
                        gui.add(cubeControl, 'surfaceArea');
                    })
                }

                scene.add(new Cube);
                break;
            }
            case 'cylinder': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]);
                    i--;
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

                        cylinderControl.volume = cylinderControl.cylHeight * Math.PI * cylinderControl.cylRadius ** 2;
                        cylinderControl.surfaceArea = 2 * Math.PI * cylinderControl.cylRadius *
                            (cylinderControl.cylHeight + cylinderControl.cylRadius);

                        gui.remove(gui.__controllers[gui.__controllers.length - 1])
                        gui.remove(gui.__controllers[gui.__controllers.length - 1])

                        gui.add(cylinderControl, 'volume');
                        gui.add(cylinderControl, 'surfaceArea');
                    })
                }

                scene.add(new Cylinder);
                break;
            }
            case 'sphere': {
                for (var i = 1; i < gui.__controllers.length; i++) {
                    gui.remove(gui.__controllers[i]);
                    i--;
                }
                guiSphParams.sphRadius = gui.add(sphereControl, 'sphRadius', 0, 500);
                gui.add(sphereControl, 'volume');
                gui.add(sphereControl, 'surfaceArea');
                guiSphParams.sphRadius.onFinishChange(function () {
                    var presentFigure = scene.getObjectByName('figure');
                    scene.remove(presentFigure);
                    scene.add(new Sphere);

                    gui.remove(gui.__controllers[gui.__controllers.length - 1])
                    gui.remove(gui.__controllers[gui.__controllers.length - 1])

                    sphereControl.volume = Math.PI * sphereControl.sphRadius ** 3;
                    sphereControl.surfaceArea = 4 * Math.PI * sphereControl.sphRadius ** 2;

                    gui.add(sphereControl, 'volume');
                    gui.add(sphereControl, 'surfaceArea');
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

    function loop() {
        renderer.render(scene, camera);
        requestAnimationFrame(function () { loop(); });
    }
    loop();
}