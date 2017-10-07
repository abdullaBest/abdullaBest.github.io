// генератор псевдослучайных чисел
let seed = 1;
function random() { 
    let x = Math.sin(seed++) * 100000;
    return x - Math.floor(x);
}

function toRad(degrees){
  return degrees * (Math.PI/180);
}


// создаем буффер
let buffer_pos = 0;
let buffer_positions = null;
let buffer_colors = null;
function create_buffer(count){
    buffer_pos = 0;
    count = count * 3; // в каждом точке 3 координаты) - считаем сколько всего цифр  
    buffer_positions = new Float32Array( count );
    buffer_colors    = new Float32Array( count );
}

function set_buff(p,c){
   buffer_positions[buffer_pos  ] = p.x;  
   buffer_colors   [buffer_pos  ] = c.r;   
   buffer_positions[buffer_pos+1] = p.y;  
   buffer_colors   [buffer_pos+1] = c.g;   
   buffer_positions[buffer_pos+2] = p.z;  
   buffer_colors   [buffer_pos+2] = c.b;   
   buffer_pos = buffer_pos+3;
}
//--------------------------------------------------
// генерируем кристал
// cx,cy,cz - центр
// v,pv1,pv2 - вектор направления, и 2 вектора основания, система координат
// radius - радиус кристала
// height - высота
// gran - количество граней
function _gen_crystal(c,v,pv1,pv2,radius,height,gran,color1,color1_2){

    var gran_angle = 2*Math.PI/gran; // угол

    var r0 = radius - radius*0.10;  // радиус основание
    var h0 = height - height*0.10;  // высота основания


    var c1  = {r:0,g:0,b:0}

    var p0  = {x:0,y:0,z:0}
    var n   = {x:0,y:0,z:0}
    var lp1 = {x:0,y:0,z:0}
    var lp2 = {x:0,y:0,z:0}
    var p1  = {x:0,y:0,z:0}
    var p2  = {x:0,y:0,z:0}

    var dx = random()*r0-r0/2;
    var dy = random()*r0-r0/2;
    // самая высокая точка кристала
    p0.x = c.x + (pv1.x*dx+pv2.x*dy) + v.x*height;
    p0.y = c.y + (pv1.y*dx+pv2.y*dy) + v.y*height;
    p0.z = c.z + (pv1.z*dx+pv2.z*dy) + v.z*height;


    c1.r = color1.r + color1_2.r;
    c1.g = color1.g + color1_2.g;
    c1.b = color1.b + color1_2.b;

    lp1.x = c.x + pv1.x*r0;
    lp1.y = c.y + pv1.y*r0;
    lp1.z = c.z + pv1.z*r0;
    lp2.x = c.x + pv1.x*radius + v.x*h0;
    lp2.y = c.y + pv1.y*radius + v.y*h0;
    lp2.z = c.z + pv1.z*radius + v.z*h0;
    var angle = gran_angle; // угол поворота
    var i = gran-1;  // граней
    do{
        p1.x = c.x + (pv1.x*Math.cos(angle)+pv2.x*Math.sin(angle))*r0;
        p1.y = c.y + (pv1.y*Math.cos(angle)+pv2.y*Math.sin(angle))*r0;
        p1.z = c.z + (pv1.z*Math.cos(angle)+pv2.z*Math.sin(angle))*r0;

        p2.x = c.x + (pv1.x*Math.cos(angle)+pv2.x*Math.sin(angle))*radius + v.x*h0;
        p2.y = c.y + (pv1.y*Math.cos(angle)+pv2.y*Math.sin(angle))*radius + v.y*h0;
        p2.z = c.z + (pv1.z*Math.cos(angle)+pv2.z*Math.sin(angle))*radius + v.z*h0;

        set_buff(p1,color1);
        set_buff(lp1,color1);
        set_buff(lp2,c1);

        set_buff(p1,color1);
        set_buff(lp2,c1);
        set_buff(p2,c1);
        // мокушка кристала
        set_buff(lp2,c1);
        set_buff(p0 ,c1);
        set_buff( p2,c1);
        // -----------------
        lp1.x = p1.x;
        lp1.y = p1.y;
        lp1.z = p1.z;
        lp2.x = p2.x;
        lp2.y = p2.y;
        lp2.z = p2.z;
        i=i-1;
        angle=angle+gran_angle;
    }while (i!=0)
    p1.x = c.x + pv1.x*r0;
    p1.y = c.y + pv1.y*r0;
    p1.z = c.z + pv1.z*r0;

    p2.x = c.x + pv1.x*radius + v.x*h0;
    p2.y = c.y + pv1.y*radius + v.y*h0;
    p2.z = c.z + pv1.z*radius + v.z*h0;

    set_buff(p1,color1);
    set_buff(lp1,color1);
    set_buff(lp2,c1);

    set_buff(p1,color1);
    set_buff(lp2,c1);
    set_buff(p2,c1);
    // мокушка кристала
    set_buff(lp2,c1);
    set_buff(p0 ,c1);
    set_buff(p2 ,c1);
}

// генератор кристалов
function gen_crystals(params){
    seed = params.seed;

    var count =  (params.num_b)*(3+3+3); // количество для одного кристала
    count = count*params.num_a;       // количество всех кристалов
    create_buffer(count);

    var c = { x:0, y:0, z:0 }
    var min_radius = params.radius1*0.60; // 60% от радиуса
    var min_height = params.dlinna.y*0.30;  //
    //-----------------------
    var v = {x:0,y:0,z:0}
    var v1 = {x:0,y:0,z:0}
    var v2 = {x:0,y:0,z:0}
    var c1 = {r:0,g:0,b:0}

    var min_delta = 0;
    //var step_delta = params.pesudo_rand_angle/params.num_a; // синусоидальная псевдослучайность

    var i = params.num_a;
    do{
        // поворачиваме на случайный градус
        var ang = random()*2*Math.PI;
        v1.x = params.vx.x*Math.cos(ang)+params.vz.x*Math.sin(ang);
        v1.y = params.vx.y*Math.cos(ang)+params.vz.y*Math.sin(ang);
        v1.z = params.vx.z*Math.cos(ang)+params.vz.z*Math.sin(ang);
        ang=ang+90;
        if (ang>=360){
            ang=ang-360;
        }
        v2.x = params.vx.x*Math.cos(ang)+params.vz.x*Math.sin(ang);
        v2.y = params.vx.y*Math.cos(ang)+params.vz.y*Math.sin(ang);
        v2.z = params.vx.z*Math.cos(ang)+params.vz.z*Math.sin(ang);


        let delta = params.dlinna.x;
        c.x = params.center.x + v1.x*delta; // положение кристала
        c.y = params.center.y + v1.y*delta;
        c.z = params.center.z + v1.z*delta;

        // высота и радиус кристала
        let h = min_height + random()*(params.dlinna.y-min_height); // высота кристала
        let r = min_radius + random()*(params.radius1-min_radius); // радиус основания


        // опускаем на случайную дельту
        delta = random()*params.radius2;
        v.x = params.vy.x*Math.cos(delta)+v1.x*Math.sin(delta);
        v.y = params.vy.y*Math.cos(delta)+v1.y*Math.sin(delta);
        v.z = params.vy.z*Math.cos(delta)+v1.z*Math.sin(delta);

        let rr = random();
        c1.r = params.color2.r + params.color3.r*rr; 
        c1.g = params.color2.g + params.color3.g*rr; 
        c1.b = params.color2.b + params.color3.b*rr; 

        var mesh = _gen_crystal(
            c,
            v,
            v1,
            v2,
            r,
            h,
            params.num_b,
            params.color1,
            c1
        );
                
        i=i-1;
    } while(i!=0)    
}

function gen_crystals_code(){

    let params = {
        vx      : {x:1,y:0,z:0},
        vy      : {x:0,y:1,z:0},
        vz      : {x:0,y:0,z:1},
        center  : {x:0,y:0,z:0},
        dlinna  : {x:10,y:80,z:0},
        num_a   : 10,
        num_b   : 3,
        radius1 : 10,
        radius2 : toRad(30),
        seed    : 30,
        color1  : {r:0.2,g:0.2,b:0.2},
        color2  : {r:0.6,g:0.0,b:0.0},
        color3  : {r:0.1,g:0.1,b:0.1},
    }
    gen_crystals(params);

}
