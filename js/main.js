let editor, render, scene, camera, controls, gridHelper, mesh=null;
let clearcolor = 0x5f5f5f;

function reSize(){
    //
    let a = w2ui.layout.get('left');
    let w = a.width-5;
    let h = a.height-5;
    $('#editor').height(h);
    $('#editor').width(w);
    editor.resize();
    //
    a = w2ui.layout.get('main');
    render.setSize(a.width, a.height);
    camera.aspect = a.width / a.height;
    camera.updateProjectionMatrix();
}

function initRender(){
    let a = w2ui.layout.get('main');
    a.overflow = 'hidden';
    scene = new THREE.Scene();
    render = new THREE.WebGLRenderer({antialias:false /*,preserveDrawingBuffer: true, logarithmicDepthBuffer:true*/,precision:'lowp' });
    render.setSize(a.width, a.height);
    render.setClearColor(clearcolor, 1);

    w2ui.layout.content('main', render.domElement);
    camera = new THREE.PerspectiveCamera( 55.0, a.width / a.height, 0.5, 1000000 );
	camera.position.set(100,100,100);
	camera.lookAt(0,0,0);
	controls = new THREE.OrbitControls( camera, render.domElement );
    scene.add(camera);
    //
    gridHelper = new THREE.GridHelper( 100, 10, 0x0000ff, 0x808080 );
	scene.add( gridHelper );
    //
    requestAnimationFrame(animate);
}

function animate(time) {
    controls.update();
    render.render(scene, camera);
    requestAnimationFrame(animate);
}


function run(){
    w2ui.layout.content('bottom','');
    let text = editor.getValue();
    try{
        eval(text);
    }catch(e){
        let s = '<textarea style="color:red;font-weight:bold;width: 100%;height: 100%;">'+e.stack+'</textarea>';
        w2ui.layout.content('bottom',s);
    }
    let geometry  = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( buffer_positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( buffer_colors, 3 ) );
    let material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
		side        : THREE.DoubleSide,
		//transparent : false,
        //wireframe   : false,
        //skinning    : true,
    });
    if (mesh!==null){
        scene.remove(mesh);
        mesh.geometry.dispose();
    }
    mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
}



function prepare(){
    let pstyle = 'background-color: #F5F6F7; border: 1px solid #dfdfdf; padding: 5px;';
    $('#layout').w2layout({
        name: 'layout',
        panels: [
            { type: 'top',  size: 30, resizable: true, style: '', content: '' },
            { type: 'left', size: '40%', resizable: true, style: pstyle, content: '' },
            { type: 'main', style: pstyle, content: '' },
            //{ type: 'preview', size: '50%', resizable: true, style: pstyle, content: 'preview' },
            //{ type: 'right', size: 200, resizable: true, style: pstyle, content: '' },
            { type: 'bottom', size: 50, resizable: true, style: '', content: '' }
        ]
    });
    //
    let a = w2ui.layout.get('left');
    a.overflow = 'hidden';
    w2ui.layout.content('left','<div id="editor"></div>');
    w2ui.layout.on('*', function (event) {
        if (event.type==='resize'){
            setTimeout(reSize,100);
        }
    });
    //
    ace.require("ace/ext/language_tools");
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setTabSize(4);
    editor.getSession().setUseSoftTabs(true);
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    //
    w2ui.layout.content('top','<div id="toolbar"></div>');
    $('#toolbar').w2toolbar({
        name: 'toolbar',
        items: [
            { type: 'button', id: 'run', text: 'Запустить', icon: 'fa-wrench' },
        ],
        onClick: function (event) {
            if (event.target==='run'){
                run();
            }
            //console.log('Target: '+ event.target, event);
        }
    });
    //
    initRender();
    //
    let s = gen_crystals_code.toString();
    let n = s.indexOf('{');
    s = s.substring(n+1,s.length-1);
    editor.setValue(s);
    //
    run();
}


prepare();