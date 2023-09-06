//碰撞箱对象
export function getFullHitBox(sprite) {
    return getHitBox(0, 0, sprite.width, sprite.height);
}
export function getPartHitBox(sprite, collideH) {
    return getHitBox(0, (1 - collideH) * sprite.height, sprite.width, collideH * sprite.height);
}
export function getHitBox(dx, dy, w, h) {
    let hitbox = {};
    hitbox.dx = dx;
    hitbox.dy = dy;
    hitbox.width = w;
    hitbox.height = h;
    return hitbox;
}

//矩形碰撞箱检测
export function HitTest(r1, r2) {
    let hit, combineWidth, combineHeight, vx, vy;
    if (r1.hitbox === undefined) r1.hitbox = getFullHitBox(r1);
    if (r2.hitbox === undefined) r2.hitbox = getFullHitBox(r2);
    hit = false;
    let r1CenterX = r1.x + r1.hitbox.dx + r1.hitbox.width / 2;
    let r1CenterY = r1.y + r1.hitbox.dy + r1.hitbox.height / 2;
    let r2CenterX = r2.x + r2.hitbox.dx + r2.hitbox.width / 2;
    let r2CenterY = r2.y + r2.hitbox.dy + r2.hitbox.height / 2;

    let r1halfwidth = r1.hitbox.width / 2;
    let r1halfheight = r1.hitbox.height / 2;
    let r2halfwidth = r2.hitbox.width / 2;
    let r2halfheight = r2.hitbox.height / 2;

    vx = Math.abs(r1CenterX - r2CenterX);
    vy = Math.abs(r1CenterY - r2CenterY);

    combineWidth = r1halfwidth + r2halfwidth;
    combineHeight = r1halfheight + r2halfheight;

    if (vx < combineWidth && vy < combineHeight) {
        hit = true;
    }

    return hit;
}

//检测控制角色是否要超出地图边界
