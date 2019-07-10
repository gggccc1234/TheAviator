function Particle() {
    let geom = new THREE.TetrahedronGeometry(3, 0);
    let mat = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);
}

Particle.prototype.explode = function(r_position, r_color, r_scale, r_callBack) {
    // TweenMax.to(object, duration, {params})
    // 1.动画目标对象  2.动画的持续时间  3.变化的属性
    let _this = this;
    this.mesh.material.color = new THREE.Color(r_color);
    this.mesh.material.needsUpdate = true;
    this.mesh.material.scale.set(r_scale, r_scale, r_scale);
    let targetX = r_position.x + (-1 + Math.random() * 2) * 50;
    let targetY = r_position.y + (-1 + Math.random() * 2) * 50;
    let duration = 0.6 + Math.random() * 2 * 50;
    TweenMax.to(this.mesh.rotation, duration, {
        x: Math.random() * 12,
        y: Math.random() * 12,
    });
    TweenMax.to(this.mesh.scale, duration, {
        x: 1,
        y: 1,
        z: 1,
    });
    TweenMax.to(this.mesh.position, duration, {
        x: targetX,
        y: targetY,
        delay: Math.random() * 0.1,
        ease: Power2.easeOut,
        onComplete: function() {
            _this.mesh.scale.set(1, 1, 1);
            if (r_callBack) {
                r_callBack();
            }
        }
    })
}