export default class CollisionController {
    static EVENT = {
        CENTER_DISTANCE: 1, // 重心距离
    }

    static _instance = null;

    static getInstance() {
        if (!CollisionController._instance) {
            CollisionController._instance = new CollisionController();
        }
        return CollisionController._instance;
    }

    checkCollision(r_groupAItems, r_groupBItems, r_callBack, r_collisionMode = CollisionController.EVENT.CENTER_DISTANCE) {
        for (let i = 0; i < r_groupAItems.length; i++) {
            let itemA = r_groupAItems[i];
            if (!itemA.mesh) {
                continue;
            }
            for (let j = 0; j < r_groupBItems.length; j++) {
                let itemB = r_groupBItems[j];
                if (!itemB.mesh) {
                    continue;
                }
                let distanceFunc = null;
                switch (r_collisionMode) {
                    case 1:
                        distanceFunc = this.centerDistance;
                        break;
                }
                if (distanceFunc) {
                    let {distance, diffPos} = distanceFunc(itemA, itemB);
                    r_callBack(itemA, i, itemB, j, distance, diffPos);
                }
            }
        }
    }

    centerDistance(r_itemA, r_itemB) {
        let diffPos = r_itemA.mesh.position.clone().sub(r_itemB.mesh.position.clone());
        let distance = diffPos.length();
        return {
            distance: distance,
            diffPos: diffPos,
        };
    }
}