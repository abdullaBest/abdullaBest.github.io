// генератор псевдослучайных чисел
let seed = 1;
function random() {
    let x = Math.sin(seed++) * 100000;
    return x - Math.floor(x);
}

function seed_rnd(){ return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER); }

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
function set_tri(p1,p2,p3,c1,c2,c3){
    set_buff(p1,c1);
    set_buff(p2,c2);
    set_buff(p3,c3);
}

//  a = b
function v_set(a,b){
    a.x = b.x;    
    a.y = b.y;    
    a.z = b.z;    
}
// умножаем a=b*c, a,b- вектор, c - число
function v_mul(a,b,c){
    a.x = b.x*c;    
    a.y = b.y*c;    
    a.z = b.z*c;    
}

function v_aacos(a,center,v1,h,v2,v3,ang,r){
    a.x = center.x + v1.x*h + (v2.x*Math.cos(ang)+v3.x*Math.sin(ang))*r;
    a.y = center.y + v1.y*h + (v2.y*Math.cos(ang)+v3.y*Math.sin(ang))*r;
    a.z = center.z + v1.z*h + (v2.z*Math.cos(ang)+v3.z*Math.sin(ang))*r;
}

// TODO оптимизировать
function bezier_v4(a1,w1,w2,w3,w4,t){
    let a2 = {x:0,y:0,z:0}
    let a3 = {x:0,y:0,z:0}
    a1.x = w1.x + (w2.x-w1.x)*t;
    a1.y = w1.y + (w2.y-w1.y)*t;
    a1.z = w1.z + (w2.z-w1.z)*t;

    a2.x = w2.x + (w3.x-w2.x)*t;
    a2.y = w2.y + (w3.y-w2.y)*t;
    a2.z = w2.z + (w3.z-w2.z)*t;

    a3.x = w3.x + (w4.x-w3.x)*t;
    a3.y = w3.y + (w4.y-w3.y)*t;
    a3.z = w3.z + (w4.z-w3.z)*t;

    a1.x = a1.x + (a2.x-a1.x)*t;
    a1.y = a1.y + (a2.y-a1.y)*t;
    a1.z = a1.z + (a2.z-a1.z)*t;

    a2.x = a2.x + (a3.x-a2.x)*t;
    a2.y = a2.y + (a3.y-a2.y)*t;
    a2.z = a2.z + (a3.z-a2.z)*t;
    
    a1.x = a1.x + (a2.x-a1.x)*t;
    a1.y = a1.y + (a2.y-a1.y)*t;
    a1.z = a1.z + (a2.z-a1.z)*t;
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
        seed    : seed_rnd(),
        color1  : {r:0.2,g:0.2,b:0.2},
        color2  : {r:0.6,g:0.0,b:0.0},
        color3  : {r:0.1,g:0.1,b:0.1},
    }
    gen_crystals(params);

}
//===============================================================
// count = 15*3;
function kol_3(w1,w2,w3,w4,v2,v3,r,c1){
    let a1 = {x:0,y:0,z:0}
    let a2 = {x:0,y:0,z:0}
    let a3 = {x:0,y:0,z:0}
    let a4 = {x:0,y:0,z:0}
    let e1 = {x:0,y:0,z:0}
    let e2 = {x:0,y:0,z:0}
    let e3 = {x:0,y:0,z:0}
    let e4 = {x:0,y:0,z:0}
    let b1 = {x:0,y:0,z:0}
    let b2 = {x:0,y:0,z:0}
    let b3 = {x:0,y:0,z:0}
    let b4 = {x:0,y:0,z:0}
    
    v_set(a1,w1);
    let d1 = r;
    bezier_v4(a2,w1,w2,w3,w4,0.3);
    let d2 = r*0.8;
    bezier_v4(a3,w1,w2,w3,w4,0.6);
    let d3 = r*0.6;
    v_set(a4,w4);

    let count = 3;  //
    let step_t = 2*Math.PI/count;
    let t = 0;
    e1.x = a1.x + (v2.x)*d1;
    e1.y = a1.y + (v2.y)*d1;
    e1.z = a1.z + (v2.z)*d1;
    e2.x = a2.x + (v2.x)*d2;
    e2.y = a2.y + (v2.y)*d2;
    e2.z = a2.z + (v2.z)*d2;
    e3.x = a3.x + (v2.x)*d3;
    e3.y = a3.y + (v2.y)*d3;
    e3.z = a3.z + (v2.z)*d3;
    for (var i=0;i<count;i++){
        t = t + step_t;
        b1.x = a1.x + (v2.x*Math.cos(t)+v3.x*Math.sin(t))*d1;
        b1.y = a1.y + (v2.y*Math.cos(t)+v3.y*Math.sin(t))*d1;
        b1.z = a1.z + (v2.z*Math.cos(t)+v3.z*Math.sin(t))*d1;
        b2.x = a2.x + (v2.x*Math.cos(t)+v3.x*Math.sin(t))*d2;
        b2.y = a2.y + (v2.y*Math.cos(t)+v3.y*Math.sin(t))*d2;
        b2.z = a2.z + (v2.z*Math.cos(t)+v3.z*Math.sin(t))*d2;
        b3.x = a3.x + (v2.x*Math.cos(t)+v3.x*Math.sin(t))*d3;
        b3.y = a3.y + (v2.y*Math.cos(t)+v3.y*Math.sin(t))*d3;
        b3.z = a3.z + (v2.z*Math.cos(t)+v3.z*Math.sin(t))*d3;

        //   a4
        // e3 b3
        // e2 b2
        // e1 b1
        set_buff(e1,c1);
        set_buff(e2,c1);
        set_buff(b2,c1);
        set_buff(e1,c1);
        set_buff(b2,c1);
        set_buff(b1,c1);

        set_buff(e2,c1);
        set_buff(e3,c1);
        set_buff(b3,c1);
        set_buff(e2,c1);
        set_buff(b3,c1);
        set_buff(b2,c1);

        set_buff(e3,c1);
        set_buff(a4,c1);
        set_buff(b3,c1);
        
        v_set(e1,b1);
        v_set(e2,b2);
        v_set(e3,b3);
    }    
}

function bush(center,v1,color1,sc,r){
    let a1 = {x:0,y:0,z:0}
    let a2 = {x:0,y:0,z:0}
    let a3 = {x:0,y:0,z:0}
    let a4 = {x:0,y:0,z:0}
    let b2 = {x:0,y:0,z:0}
    let c1 = {r:0,g:0,b:0 }

    const count = 3;
    const step_d = 1/count;
    const step_c = 0.15/count;
    //const r = 15;
    let d = step_d;
    let cc = 0;

    a1.x = center.x + v1.x*d;
    a1.y = center.y + v1.y*d;
    a1.z = center.z + v1.z*d;

    //a1 a3
    //a2 a4
    a2.x = a1.x;      a2.y = a1.y;   a2.z = a1.z + r;
    a3.x = a1.x + r;  a3.y = a1.y;   a3.z = a1.z;
    a4.x = a1.x + r;  a4.y = a1.y;   a4.z = a1.z + r;

    let r1 = Math.random();
    let dc1 = color1.r + 0.10 * r1;
    let dc2 = color1.g + 0.10 * r1;
    let dc3 = color1.b + 0.10 * r1;

    c1.r = sc + dc1 + cc;
    c1.g = sc + dc2 + cc;
    c1.b = sc + dc3 + cc;
    cc=cc+step_c;
    set_tri(a1,a4,a2,c1,c1,c1);

    d=d+step_d;
    a1.x = center.x + v1.x*d;
    a1.y = center.y + v1.y*d;
    a1.z = center.z + v1.z*d;

    a2.x = a1.x;      a2.y = a1.y;   a2.z = a1.z + r;
    a3.x = a1.x + r;  a3.y = a1.y;   a3.z = a1.z;
    a4.x = a1.x + r;  a4.y = a1.y;   a4.z = a1.z + r;

    c1.r = sc + dc1 + cc;
    c1.g = sc + dc2 + cc;
    c1.b = sc + dc3 + cc;
    cc=cc+step_c;
    set_tri(a4,a2,a3,c1,c1,c1);
    //----------------------------------------
    d=d+step_d;
    a1.x = center.x + v1.x*d;
    a1.y = center.y + v1.y*d;
    a1.z = center.z + v1.z*d;
    a2.x = a1.x;      a2.y = a1.y;   a2.z = a1.z + r;
    a3.x = a1.x + r;  a3.y = a1.y;   a3.z = a1.z;
    a4.x = a1.x + r;  a4.y = a1.y;   a4.z = a1.z + r;

    c1.r = sc + dc1 + cc;
    c1.g = sc + dc2 + cc;
    c1.b = sc + dc3 + cc;
    cc=cc+step_c;
    set_tri(a1,a3,a4,c1,c1,c1);
    set_tri(a1,a4,a2,c1,c1,c1);
}


function gen_tree(params){
    let a1 = {x:0,y:0,z:0}
    let a2 = {x:0,y:0,z:0}
    let a3 = {x:0,y:0,z:0}
    let a4 = {x:0,y:0,z:0}
    let a5 = {x:0,y:0,z:0}
    let a6 = {x:0,y:0,z:0}
    let a7 = {x:0,y:0,z:0}
    let a8 = {x:0,y:0,z:0}
    let b1 = {x:0,y:0,z:0}
    let b2 = {x:0,y:0,z:0}
    let b3 = {x:0,y:0,z:0}
    let b4 = {x:0,y:0,z:0}
    let e1 = {x:0,y:0,z:0}
    let e2 = {x:0,y:0,z:0}
    let e3 = {x:0,y:0,z:0}
    let v1 = {x:0,y:0,z:0}
    let v2 = {x:0,y:0,z:0}
    let v3 = {x:0,y:0,z:0}
    let v4 = {x:0,y:0,z:0}
    let vv1 = {x:0,y:0,z:0}
    let vv2 = {x:0,y:0,z:0}
    let vv3 = {x:0,y:0,z:0}
    let vv4 = {x:0,y:0,z:0}
    let w1 = {x:0,y:0,z:0}
    let w2 = {x:0,y:0,z:0}
    let w3 = {x:0,y:0,z:0}
    let w4 = {x:0,y:0,z:0}
    let c0 = {r:0,g:0,b:0 }
    let c1 = {r:0.3,g:0.3,b:0.25 }
    let c2 = {r:0.45,g:0.45,b:0.4 }
    let c3 = {r:0.5,g:0.5,b:0.4 }
    let vh = {x:0,y:1,z:0}
    
    seed = params.seed;
    // цвет ствола
    let r = random()*0.10;
    c1.r = 0.05 + r;
    c1.g = 0.15 + r;
    c1.b = 0.05 + r;
    let dlinna = params.dlinna.y;
    let num_a = params.num_a;
  
    let count3 = Math.trunc(num_a*(num_a+1)/2);
    create_buffer( (count3*12) + 15*3 + num_a*(15*3) );
    // высота дерева
    let h  = dlinna*0.80 + random()*dlinna*0.20 
    let r2 = dlinna*0.04;  // радиус середины 
    let r3 = dlinna*0.05;  // радиус середины 
    let r4 = dlinna*0.06;  // радиус верхушки
    v1.x = 0; v1.y = h; v1.z = 0;  
    v2.x = 1; v2.y = 0; v2.z = 0;
    v3.x = 0; v3.y = 0; v3.z = 1;
    //-----------------------   
    v_set(w1,params.center);
    v_aacos(w2,w1,v1,0.30,v2,v3,random()*2*Math.PI,r2);
    v_aacos(w3,w1,v1,0.60,v2,v3,random()*2*Math.PI,r3);
    v_aacos(w4,w1,v1,1.00,v2,v3,random()*2*Math.PI,r4);
    // радиус пинька
    let r1 = dlinna*0.025 + random()*dlinna*0.01;  
    kol_3(w1,w2,w3,w4,v2,v3,r1,params.color2);
    //-----------------------
    let t = 0.2;  // стартовая позиция отрисовки веток на стволе
    let t2 = 0.2;
    let count = num_a;
    let count2 = num_a;
    let step_t = (1-t)/count;
    let tcc = 0.00 + random()*0.05;
    for (let i=0;i<count;i++){
        let ang1 = random()*2*Math.PI;
        v1.x =  Math.cos(ang1); v1.y = 0;   v1.z = Math.sin(ang1);
        v2.x = -Math.sin(ang1); v2.y = 0;   v2.z = Math.cos(ang1);
        v3.x = 0;               v3.y = 1;   v3.z = 0;
        ang1 = toRad(30+random()*30);        
        v4.x = v1.x*Math.cos(ang1) + v3.x*Math.sin(ang1);
        v4.y = v1.y*Math.cos(ang1) + v3.y*Math.sin(ang1);
        v4.z = v1.z*Math.cos(ang1) + v3.z*Math.sin(ang1);
        v3.x = v3.x*Math.cos(ang1) - v1.x*Math.sin(ang1);
        v3.y = v3.y*Math.cos(ang1) - v1.y*Math.sin(ang1);
        v3.z = v3.z*Math.cos(ang1) - v1.z*Math.sin(ang1);
        //let hh = (h*0.3 + h*(1-t))*0.3
        let hh = (h*0.5 + h*(1-t))*0.5;
        v_mul(v1,v4,hh);
        //-----------------------
        bezier_v4(a1,w1,w2,w3,w4,t);
        v_aacos(a2,a1,v1,0.30,v2,v3,random()*2*Math.PI,r2);
        v_aacos(a3,a1,v1,0.60,v2,v3,random()*2*Math.PI,r3);
        v_aacos(a4,a1,v1,1.00,v2,v3,random()*2*Math.PI,r4);
        //
        let rr = r1*(1-t)*0.4;  // радиус пинька
        kol_3(a1,a2,a3,a4,v2,v3,rr,c1);
        //-----------------------
        //let count2 = 1+Math.trunc((1-t)*num_a);
        let step_t2 = (1-t2)/count2;
        let tt = t2;
        for (let j=0;j<count2;j++){
            ang1 = random()*2*Math.PI;
            vv1.x = v2.x*Math.cos(ang1) + v3.x*Math.sin(ang1);
            vv1.y = v2.y*Math.cos(ang1) + v3.y*Math.sin(ang1);
            vv1.z = v2.z*Math.cos(ang1) + v3.z*Math.sin(ang1);
            vv2.x = v3.x*Math.cos(ang1) - v2.x*Math.sin(ang1);
            vv2.y = v3.y*Math.cos(ang1) - v2.y*Math.sin(ang1);
            vv2.z = v3.z*Math.cos(ang1) - v2.z*Math.sin(ang1);
            ang1 = toRad(360-(10+random()*30));
            vv3.x = v4.x*Math.cos(ang1) + vv1.x*Math.sin(ang1);
            vv3.y = v4.y*Math.cos(ang1) + vv1.y*Math.sin(ang1);
            vv3.z = v4.z*Math.cos(ang1) + vv1.z*Math.sin(ang1);
            vv1.x = vv1.x*Math.cos(ang1) - v4.x*Math.sin(ang1);
            vv1.y = vv1.y*Math.cos(ang1) - v4.y*Math.sin(ang1);
            vv1.z = vv1.z*Math.cos(ang1) - v4.z*Math.sin(ang1);
            //
            let hhh = hh*(1-tt)*0.5;
            v_mul(vv1,vv1,hhh);
            //
            bezier_v4(b1,a1,a2,a3,a4,tt);
            v_aacos(b2,b1,vv1,0.30,vv2,vv3,random()*2*Math.PI,rr);
            v_aacos(b3,b1,vv1,0.60,vv2,vv3,random()*2*Math.PI,rr);
            v_aacos(b4,b1,vv1,1.00,vv2,vv3,random()*2*Math.PI,rr);
            //
            let bb = {x:0,y:0,z:0}
            bb.x = b4.x-b1.x;
            bb.y = b4.y-b1.y;
            bb.z = b4.z-b1.z;
            bush(b1,bb,params.color1,tcc,h*0.02);
            
            tt=tt+step_t2;
        }
        count2 = count2 - 1;
        //-----------------------
        t=t+step_t;
    }    
}

function gen_tree_code(){
    let params = {
        center  : {x:0,y:0,z:0},
        dlinna  : {x:20,y:50,z:10},
        num_a   : 60,
        color1  : {r:0.0,g:0.14,b:0.0},
        color2  : {r:0.3,g:0.3,b:0.25},
        seed    : seed_rnd(),
    }
    gen_tree(params);
}
