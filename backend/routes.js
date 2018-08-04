const out = {};

out.getProps = (req, res) => {
    res.set('Content-Type', 'application/json');
    switch (req.body.type) {
        case 'cube': {
            console.log('cube');
            var volume = req.body.cubeHeight * req.body.cubeLength * req.body.cubeWidth;
            var surfaceArea = 2 * (req.body.cubeHeight * req.body.cubeLength +
                req.body.cubeHeight * req.body.cubeWidth + req.body.cubeLength * req.body.cubeWidth);
            res.send(JSON.stringify({ volume: volume, surfaceArea: surfaceArea }));
            break;
        }
        case 'cylinder': {
            console.log('cylinder');
            var volume = req.body.cylHeight * Math.PI * req.body.cylRadius ** 2;
            var surfaceArea = 2 * Math.PI * req.body.cylRadius *
                (req.body.cylHeight + req.body.cylRadius);
            res.send(JSON.stringify({ volume: volume, surfaceArea: surfaceArea }));
            break;
        }
        case 'sphere': {
            console.log('sphere');
            var volume = Math.PI * req.body.sphRadius ** 3;
            var surfaceArea = 4 * Math.PI * req.body.sphRadius ** 2;
            res.send(JSON.stringify({ volume: volume, surfaceArea: surfaceArea }));
            break;
        }
    }
};

module.exports = out;