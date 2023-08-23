
//矩形碰撞箱检测
function HitTest(r1, r2) {
    let hit, combineWidth, combineHeight, vx, vy;
    hit = false;
    r1.CenterX = r1.x + r1.width / 2;
    r1.CenterY = r1.y + r1.height / 2;
    r2.CenterX = r2.x + r2.width / 2;
    r2.CenterY = r2.y + r2.height / 2;

    r1.halfwidth = r1.width / 2;
    r1.halfheight = r1.height / 2;
    r2.halfwidth = r2.width / 2;
    r2.halfheight = r2.height / 2;

    vx = Math.abs(r1.CenterX - r2.CenterX);
    vy = Math.abs(r1.CenterY - r2.CenterY);

    combineWidth = r1.halfwidth + r2.halfwidth;
    combineHeight = r1.halfheight + r2.halfheight;

    if (vx < combineWidth && vy < combineHeight) {
        hit = true;
    }

    return hit;
}

//检测控制角色是否要超出地图边界
function CrossTheBoader(r) {
    let over, leftboader, rightboader, upboader, downboader;
    over = true;
    let win = document.getElementById("GameWindow");
    leftboader = 0;
    upboader = 0;
    rightboader = win.clientWidth;
    downboader = win.clientHeight;
    //对于一个矩形碰撞箱，取第一个点为左上角，第二个点为右下角
    r.firstnodeX = r.x;
    r.firstnodeY = r.y;
    r.secondnodeX = r.x + r.width;
    r.secondnodeY = r.y + r.height;
    //alert(r.firstnodeX);
    if (r.firstnodeX <= rightboader && r.firstnodeX >= leftboader
        && r.firstnodeY >= upboader && r.firstnodeY <= downboader
        && r.secondnodeX <= rightboader && r.secondnodeX >= leftboader
        && r.secondnodeY >= upboader && r.secondnodeY <= downboader) {
        over = false;
    }
    return over;
}