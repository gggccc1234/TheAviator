function Sea() {
    this.geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geom.mergeVertices();
    var l = geom.vertices.length;
    
    let mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        
    });

}