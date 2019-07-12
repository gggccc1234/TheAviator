import Base from "./baseComponent.js"; 

export default class Coin extends Base {
    constructor() {
        super();
        let geom = new THREE.TetrahedronGeometry(5, 0);
        let mat = new THREE.MeshPhongMaterial({
            color: 0x009999,
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading,
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.castShadow = true;
        this.angle = 0;
        this.distance = 0;
    }
}

