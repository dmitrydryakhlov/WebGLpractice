const out = {};

out.getProps = (req, res) => {
    res.set('Content-Type', 'application/json');
    switch (req.body.type) {
        case 'cube': {
            var volume = req.body.cubeHeight * req.body.cubeLength * req.body.cubeWidth;
            var surfaceArea = 2 * (req.body.cubeHeight * req.body.cubeLength +
                req.body.cubeHeight * req.body.cubeWidth + req.body.cubeLength * req.body.cubeWidth);
            res.send(JSON.stringify({ type: 'props',  volume: volume, surfaceArea: surfaceArea }));
            break;
        }
        case 'cylinder': {
            var volume = req.body.cylHeight * Math.PI * req.body.cylRadius ** 2;
            var surfaceArea = 2 * Math.PI * req.body.cylRadius *
                (req.body.cylHeight + req.body.cylRadius);
            res.send(JSON.stringify({ type: 'props',  volume: volume, surfaceArea: surfaceArea }));
            break;
        }
        case 'sphere': {
            var volume = Math.PI * req.body.sphRadius ** 3;
            var surfaceArea = 4 * Math.PI * req.body.sphRadius ** 2;
            res.send(JSON.stringify({ type: 'props', volume: volume, surfaceArea: surfaceArea }));
            break;
        }
    }
};

out.triangulation = (req, res) => {
    res.set('Content-Type', 'application/json');
    let l = req.body.trngLength;
    let h = req.body.trngWidth;
    let w = req.body.trngHeight;
    var vertices = [
        0,0,0, 0,0,h, l,0,h,
        0,0,0, l,0,0, l,0,h,
        
        0,w,0, 0,w,h, l,w,h,
        0,w,0, l,w,0, l,w,h,
        
        l,0,0, l,0,h, l,w,0,
        l,w,h, l,0,h, l,w,0,
        
        0,0,0, 0,0,h, 0,w,0,
        0,w,h, 0,0,h, 0,w,0,
        
        l,0,h, 0,0,h, l,w,h,
        0,w,h, 0,0,h, l,w,h,
        
        l,0,0, 0,0,0, l,w,0,
        0,w,0, 0,0,0, l,w,0,
    ];
    res.send(JSON.stringify({ type: 'triangulation', vertices: vertices }));
}

module.exports = out;