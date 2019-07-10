function ParticlesHolder() {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
    this.particlesPool = [];
}

ParticlesHolder.prototype.spawnParticles = function (r_position, r_density, r_color, r_scale) {
    let nParticles = r_density;
    for (let i = 0; i < nParticles; i++) {
        let particle = null;
        if (this.particlesPool.length) {
            particle = this.particlesPool.pop();
        } else {
            particle = new Particle();
        }
        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        particle.mesh.position.x = r_position.x;
        particle.mesh.position.y = r_position.y;
        particle.explode(r_position, r_color, r_scale, () => {
            this.mesh.remove(particle.mesh);
            this.particlesPool.unshift(particle);
        })
    }
}

ParticlesHolder.prototype.addItem = function (num) {
    for (let i = 0; i < num; i++) {
        let particle = new Particle();
        this.particlesPool.push(particle);
    }
}