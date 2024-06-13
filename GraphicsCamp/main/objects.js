/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { CubeUVReflectionMapping, CylinderGeometry, Group, LatheBufferGeometry, Mesh, MeshStandardMaterial, Vector3, Vector4 } from "../libs/CS559-Three/build/three.module.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import { FbxGrObject } from "../libs/CS559-Framework/loaders.js";

// define your buildings here - remember, they need to be imported
// into the "main" program

const PI = 3.1415926535;

let moundctr = 0;
let moundDisplace = new T.TextureLoader().load("./textures/noiseTexturebarred.png");
export class Mound extends GrObject{
    constructor(params = {}){
        let mm = new T.SphereGeometry(3);
        let smat = shaderMaterial("./mound.vs","./mound.fs",{
            uniforms:{
                disMap: {value:moundDisplace} 
            }
        })
        let mmat = new T.MeshStandardMaterial({color: 'brown', metalness:.1, roughness: .9});
        let mesh = new T.Mesh(mm,smat);        
        super(`mound${moundctr++}`, mesh);
        this.whole_ob = mesh;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 0;
        this.whole_ob.scale.set(scale,scale,scale); 
    }      
}


let dumpTruckCtr = 0;
export class GrDumpTruck extends GrObject {
  constructor(params = {}) {
    let dumpTruck = new T.Group();

    let dbody = new T.BoxGeometry(2,1,4);
    let dbodyMesh = new T.Mesh(dbody, new T.MeshStandardMaterial({color:'yellow', metalness:.5, roughness:.7}))
    dumpTruck.add(dbodyMesh);
    dbodyMesh.translateY(1);

    let dFront = new T.BoxGeometry(2,1,1);
    let dFrontMesh = new T.Mesh(dFront,new T.MeshStandardMaterial({color:'yellow', metalness:.5, roughness:.7}));
    dumpTruck.add(dFrontMesh);
    dFrontMesh.translateY(2);
    dFrontMesh.translateZ(1);

    let bed_group = new T.Group();
    dumpTruck.add(bed_group);
    bed_group.translateY(1.5);
    bed_group.translateZ(-2);

    let bed1 = new T.BoxGeometry(2,.2,2.5);
    let bed1Mesh = new T.Mesh(bed1, new T.MeshStandardMaterial({color:'#888888', metalness:.6, roughness:.3}));
    bed_group.add(bed1Mesh);
    bed1Mesh.translateY(.1);
    bed1Mesh.translateZ(1.25);

    let bed2 = new T.BoxGeometry(2,.8,.2);
    let bed2Mesh = new T.Mesh(bed2, new T.MeshStandardMaterial({color:'#888888', metalness:.6, roughness:.3}));
    bed_group.add(bed2Mesh);
    bed2Mesh.translateY(.6);
    bed2Mesh.translateZ(2.4);

    let bed3 = new T.BoxGeometry(.2,.8,2.4);
    let bed3Mesh = new T.Mesh(bed3, new T.MeshStandardMaterial({color:'#888888',metalness:.6, roughness:.3}));
    bed_group.add(bed3Mesh);
    bed3Mesh.translateY(.6);
    bed3Mesh.translateZ(1.2);
    bed3Mesh.translateX(.9);

    let bed4Mesh = bed3Mesh.clone();
    bed_group.add(bed4Mesh);
    bed4Mesh.translateX(-1.8);

    let tailgate_group = new T.Group();
    bed_group.add(tailgate_group);
    tailgate_group.translateY(.2);

    let tailgate = new T.BoxGeometry(1.6,.8,.2);
    let tMesh = new T.Mesh(tailgate, new T.MeshStandardMaterial({color:'#888888', metalness:.6, roughness:.3}));
    tailgate_group.add(tMesh);
    tMesh.translateZ(.1);
    tMesh.translateY(.4);

    let wheel = new T.TorusGeometry(.4,.25,16,16);
    let wheelMesh = new T.Mesh(wheel, new T.MeshStandardMaterial({color:'black', metalness:.7, roughness:.9}))
    dumpTruck.add(wheelMesh);
    wheelMesh.rotateY(Math.PI/2);
    wheelMesh.translateZ(1.2);
    wheelMesh.translateX(1.2);
    wheelMesh.translateY(.75);

    let wheel2 = wheelMesh.clone();
    wheel2.translateX(-2.4);
    dumpTruck.add(wheel2);

    let wheel3 = wheelMesh.clone();
    wheel3.translateZ(-2.4);
    dumpTruck.add(wheel3);

    let wheel4 = wheel2.clone();
    wheel4.translateZ(-2.4);
    dumpTruck.add(wheel4);

    let window = new T.BoxGeometry(1.8,.8,.05);
    let windowMesh = new T.Mesh(window, new T.MeshStandardMaterial({color:'skyblue', metalness:.8, roughness:.5 }));
    dumpTruck.add(windowMesh);
    windowMesh.translateY(2);
    windowMesh.translateZ(1.525);

    super(`DumpTruck`, dumpTruck);
    this.rideable = windowMesh;
    this.whole_ob = dumpTruck;
    this.bed = bed_group;
    this.tailgate = tailgate_group;

    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    this.whole_ob.rotation.y = params.rotation ? Number(params.rotation) :0;
    let scale = params.size ? Number(params.size) : 1;
    this.initPos = [this.whole_ob.position.x,this.whole_ob.position.z,params.rotation ? Number(params.rotation) :0];
    this.time = 0;
    this.xdif = 0;
    this.zdif = 0;
    this.rdif = 0;
    this.end = true;
    dumpTruck.scale.set(scale, scale, scale);
  }
  stepWorld(delta){
    this.time += delta/1000;
    this.time = this.time%33;
    if(this.time<11 ){this.end = true;}
    else if( this.time<14){
      //drive away with "full" load
        this.whole_ob.translateZ(delta*3.5/1000);
    } else if(this.time<16){
      //round the corner
        this.whole_ob.rotateY(delta*PI/4000);
        this.whole_ob.translateZ(delta*3.5/1000);
    } else if(this.time<19){
      //drive to sharp turn
        this.whole_ob.rotation.y = 3*PI/2

        this.whole_ob.translateZ(delta*4.4/1000);
    } else if(this.time<20){
      //make sharp turn
        this.whole_ob.rotateY(delta*PI/1450);
        this.whole_ob.translateZ(delta*2/1000);
    } else if(this.time<23){
      //drive to pile
        this.whole_ob.rotation.y = 3*PI/2 + PI/1.45

        this.whole_ob.translateZ(delta*6/1000);
    } else if(this.time<23.5){
      //round pile corner
        this.whole_ob.rotateY(2*delta*PI/3150);
        this.whole_ob.translateZ(2*delta*2/1000);
    } else if(this.time<25){
      //back up to pile
        this.whole_ob.rotation.y = PI/2 

        this.whole_ob.translateZ(-delta*2.6/1250);
    } else if(this.time<26){
      //dump bed
        this.bed.rotateX(-delta*PI/3000);
        this.tailgate.rotateX(-delta*PI/2000);
    }else if(this.time<28){
      //wait for load to "empty"
    } else if(this.time<29){
      //reset bed
        this.bed.rotateX(delta*PI/3000);
        this.tailgate.rotateX(delta*PI/2000);
    } else if(this.time<31){
      //drive back to original
        this.bed.rotation.x = 0
        this.tailgate.rotation.x = 0

        this.whole_ob.translateZ(delta*4/1000);
    } else if(this.time<32
    ){
      //round rinal corner
      this.whole_ob.translateZ(delta*1.9/1000)
      this.whole_ob.rotateY(19/48*PI*delta/1000)
  
    } else if(this.time<32.5){
      //reset position
        if(this.end){
            this.end = false;
            this.xdif = this.initPos[0]-this.whole_ob.position.x;
            this.zdif = this.initPos[1]- this.whole_ob.position.z;
            this.rdif = (this.whole_ob.rotation.y - this.initPos[2])%(2*PI)+PI
        }
        this.whole_ob.position.x+= 2*this.xdif*delta/1000;
        this.whole_ob.position.z+= 2*this.zdif*delta/1000;
        this.whole_ob.rotateY(2*delta*this.rdif/1000);
    } else if(this.time<33){
        this.whole_ob.position.x = this.initPos[0];
        this.whole_ob.position.z = this.initPos[1];
        this.whole_ob.rotation.y = 0;
    }
  }
  
}

let skidLoaderCtr = 0;
export class GrSkidLoader extends GrObject {
  constructor(params = {}) { 
    let skidLoader = new T.Group();
    let exSettings = {
      steps: 2,
      depth: 2,
      bevelEnabled: false
    };
    let wheel = new T.TorusGeometry(.4,.2,16,16);
    let wheelMesh = new T.Mesh(wheel, new T.MeshStandardMaterial({color:'black', metalness:.7, roughness:.9}))
    skidLoader.add(wheelMesh);
    wheelMesh.rotateY(Math.PI/2);
    wheelMesh.translateY(.6);
    wheelMesh.translateX(.6);
    wheelMesh.translateZ(1.2);
    
    let wheel2 = wheelMesh.clone();
    skidLoader.add(wheel2);
    wheel2.translateX(-1.2);

    let wheel3 = wheelMesh.clone();
    skidLoader.add(wheel3);
    wheel3.translateZ(-2.4);
  
    let wheel4 = wheel2.clone();
    skidLoader.add(wheel4);
    wheel4.translateZ(-2.4);
    
    let body1 = new T.BoxGeometry(2,1,2);
    let body1Mesh = new Mesh(body1, new T.MeshStandardMaterial({color:'yellow', metalness:.5, roughness:.7 }));
    skidLoader.add(body1Mesh);
    body1Mesh.translateY(.75);
    
     let body2 = new T.BoxGeometry(2,1,1);
     let body2Mesh = new Mesh(body2, new T.MeshStandardMaterial({color:'yellow', metalness:.5, roughness:.7 }));
     skidLoader.add(body2Mesh);
     body2Mesh.translateY(1.75);
     body2Mesh.translateZ(-.5);

    let body3 = new T.BoxGeometry(2,1.5,1);
    let body3Mesh = new Mesh(body3, new T.MeshStandardMaterial({color:'skyblue', metalness:.8, roughness:.5 }));
    skidLoader.add(body3Mesh);
    body3Mesh.translateY(2);
    body3Mesh.translateZ(.5);

    let arm = new T.Group();
    skidLoader.add(arm);
    arm.translateY(2.25);
    arm.translateZ(-1);
    arm.translateX(1);

    let mainArm = new T.BoxGeometry(.1,.2,3);
    let mainArmMesh = new T.Mesh(mainArm, new T.MeshStandardMaterial({color:'yellow', metalness:.5, roughness: .7 }));
    arm.add(mainArmMesh)
    mainArmMesh.translateX(.05);
    mainArmMesh.translateY(-.1);
    mainArmMesh.translateZ(1.5);

    let mainArm2 = mainArmMesh.clone();
    arm.add(mainArm2)
    mainArmMesh.translateX(-2.1);

    let bucket_group = new T.Group();
    mainArm2.add(bucket_group);
    bucket_group.translateZ(1.4)
    bucket_group.rotateY(Math.PI/2);
    bucket_group.translateZ(-2.05);
    bucket_group.translateY(.1)
    let bucket_curve = new T.Shape();

    bucket_curve.moveTo(0,0);
    bucket_curve.lineTo(0,-.5);
    bucket_curve.lineTo(-.75,-.5);
    bucket_curve.lineTo(0,0);
    
    let bucket_geom = new T.ExtrudeGeometry(bucket_curve, exSettings);
    let bucketMesh = new T.Mesh(bucket_geom, new T.MeshStandardMaterial({color:'#888888', metalness:.6,roughness:.3}));
    bucket_group.add(bucketMesh);



    super(`SkidLoader`, skidLoader);
    this.rideable = body2Mesh;
    this.whole_ob = skidLoader;
    this.arm = arm;
    this.bucket = bucket_group;
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    this.time = 0;
    this.initPos = [this.whole_ob.position.x,this.whole_ob.position.z, this.whole_ob.rotation.y];
    this.dif = [0,0,0]
    this.end = true;
    this.end2 = true;
    this.arm.rotateX(PI/6);
    this.bucket.rotateZ(-PI/6);
    skidLoader.scale.set(scale, scale, scale);
}
  stepWorld(delta){
    this.time+=delta/1000;
    this.time = this.time%33;
    if(this.time<1){
      //drive up to dirt
        this.end = true;
        this.whole_ob.translateZ(2*delta/1000)
    } else if(this.time<2){
      //scoop dirt
        this.whole_ob.position.z = Math.round(this.whole_ob.position.z)
        
        this.arm.rotateX(-delta*PI/3000);
        this.bucket.rotateZ(delta*PI/4000);
    } else if(this.time<3){
      //back up from pile
        this.arm.rotation.x = PI/6-PI/3
        this.bucket.rotation.z = 0

        this.whole_ob.translateZ(-2*delta/1000);
    } else if(this.time<4){
      //turn to the right
        this.whole_ob.position.z = Math.round(this.whole_ob.position.z)
        
        this.whole_ob.rotateY(-delta*PI/2000)
    } else if(this.time<6){
      //drive to left
        this.whole_ob.rotation.y = 3*PI/2

        this.whole_ob.translateZ(2.5*delta/1000);
    } else if(this.time<7){
      //turn to truck
        this.whole_ob.position.z = Math.round(this.whole_ob.position.z)
        
        this.whole_ob.rotateY(delta*-PI/2000)
    } else if(this.time<8.5){
      //drive up to truck
        this.whole_ob.rotation.y = 0

        this.whole_ob.translateZ(2.4*delta/1000)
    } else if(this.time<9.5){
      //dump bucket
        this.whole_ob.position.z = Math.floor(this.whole_ob.position.z)+0.4

        this.bucket.rotateZ(delta*PI/2500);
    } else if (this.time<10.5){ 
      //wait for bucket to 'empty'
        
    } else if(this.time<12){ 
      //back up while resetting bucket and arms
        this.whole_ob.translateZ(-2.4*delta/1000);
        this.bucket.rotateZ(-delta*PI*13/30000);
        this.arm.rotateX(delta*PI/4500);
    } else if(this.time<13){
        this.whole_ob.position.z = Math.round(this.whole_ob.position.z)
        this.bucket.rotation.z = 0;
        this.arm.rotation.x = PI/6
      //turn to the right
        this.whole_ob.rotateY(-delta*PI/2000);
    } else if (this.time<15){
        this.whole_ob.rotation.y = -3*PI/2
      //drive back to starting spot
        this.whole_ob.translateZ(2.5*delta/1000);
    }else if(this.time<16){
      //turn a prescribed 90 degrees while navigating to orignal x,z coordinates
        if(this.end){
            this.end = false;
            this.dif[0] = this.initPos[0]-this.whole_ob.position.x;
            this.dif[1] = this.initPos[1]-this.whole_ob.position.z;
        }
        this.whole_ob.rotateY(-delta*PI/2000);
        this.whole_ob.position.x+= this.dif[0]*delta/1000;
        this.whole_ob.position.z+= this.dif[1]*delta/1000;

        //reset bucket and arm positions while moving to make it less obvious - this eliminates buildup of small 'delta' deviations
        this.bucket.setRotationFromEuler(new T.Euler(5*PI/6,PI/2,PI))
        this.arm.setRotationFromEuler(new T.Euler(PI/6,0,0))
    } else if(this.time<17){
      //final angular correction to original orientation
        if(this.end2){
            this.end2 = false;
            this.dif[2] = this.initPos[2] - this.whole_ob.rotation.y;
          }
        this.whole_ob.rotateY(delta*this.dif[2]/1000);
    } else if(this.time<18){
        this.whole_ob.position.x = this.initPos[0];
        this.whole_ob.position.z = this.initPos[1];
        this.whole_ob.rotation.y = this.initPos[2];
    }
  }

}



export class DirtPath extends GrObject {
    constructor(){
        let width = 2;
        let turnMod = 1.25;
        let curve = new T.Shape();
        curve.moveTo(-15,-20);
        curve.lineTo(-15,-10);
        curve.lineTo(-10,-4);
        curve.lineTo(5,-4);
        //circle
        let circShif = 5;
        curve.lineTo(circShif+4, 0);
            //loop off of comon
        curve.lineTo(circShif+4,10);
        curve.lineTo(circShif+2.25,10+turnMod);
        curve.lineTo(circShif-2,10+turnMod);
        curve.lineTo(-7.75,-4.25);

        curve.lineTo(-10.25,-4.25);
        curve.lineTo(circShif-2-turnMod,12+turnMod);
            //construction circle
            curve.lineTo(8.5,13.25);
            curve.lineTo(8.5,17.85);
            curve.lineTo(10.25,19);
            curve.lineTo(15.25,19);
            curve.lineTo(17,17.25);
            curve.lineTo(17,13);
            curve.lineTo(15.25,11.35);  
            curve.lineTo(11,11.35);
        
        curve.lineTo(circShif+6, 0);
        curve.lineTo(circShif+10,-4);
        curve.lineTo(circShif+10,-6);
        curve.lineTo(circShif+6,-10);
        curve.lineTo(circShif+4,-10);
        //curve.lineTo();

        curve.lineTo(5,-4-width);
        curve.lineTo(-10+turnMod,-4-width);
        curve.lineTo(-15+width,-10-turnMod);
        curve.lineTo(-15+width, -20);
        curve.lineTo(-15,-20);

        let geom = new T.ExtrudeGeometry(curve,{steps:1, depth:.02});
        let material = new T.MeshStandardMaterial({ color: 'brown', metalness:.2, roughness: .8});
        let mesh = new T.Mesh(geom, material);
        mesh.translateY(.01);
        super('Dirt Path', mesh);
    }
}

let tentCtr = 0;
export class Tent extends GrObject{
    constructor(params = {}){
        let left = new T.BoxGeometry(.025/2,1,1.5);
        let right = new T.BoxGeometry(.025/2,1,1.5); 
        //may not do this for performance issues
        let mat = new T.MeshStandardMaterial({color:params.color?params.color:"white", side: T.DoubleSide});
        let LeftTent = new T.Mesh(left, mat);
        LeftTent.translateY(.5);
       
        let lT = new T.Group();
        lT.add(LeftTent);
        lT.rotateZ(PI/6);
        lT.position.x +=1/2;
        let rightTent = new T.Mesh(right,mat);
        rightTent.translateY(.5);
        let rT = new T.Group();
        rT.add(rightTent);
        rT.rotateZ(-PI/6);
        rT.position.x -= 1/2;

        let backing = new T.BufferGeometry();
        let backV = new Float32Array( [
            -.5, 0, -.65,  .5, 0, -.65,   0,.866,-.65
        ]);
        backing.setAttribute('position', new T.BufferAttribute(backV,3));
        backing.computeVertexNormals();
       // let backing = new T.Triangle(new Vector3(-.5,0,-.65),new Vector3(.5,0,-.65),new Vector3(0,.866,-.65);
        let back = new T.Mesh(backing, mat);

        let front1 = new T.BufferGeometry();
        let front1V = new Float32Array( [
            -.5, 0, .65,  0, 0, .65,   0,.866,.65
        ]);
        front1.setAttribute('position', new T.BufferAttribute(front1V,3));
        front1.computeVertexNormals();
       // let backing = new T.Triangle(new Vector3(-.5,0,-.65),new Vector3(.5,0,-.65),new Vector3(0,.866,-.65);
        let front11 = new T.Mesh(front1, mat);


        let floorgeom = new T.BoxGeometry(.98,.025/2,1.3);
        let floor = new T.Mesh(floorgeom, mat);
        floor.translateY(.025/2);
        let group = new T.Group();
        group.add(lT);
        group.add(rT);
        group.add(back);
        group.add(front11);
        group.add(floor);
        let size = params.size?params.size:1;
        group.scale.set(size,size,size);

        super(`Tent${tentCtr++}`, group);
        this.whole_ob = group;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.y = params.rotation?params.rotation:0;
    }
}

export class Bus extends GrObject{
    constructor(params = {}){
        let geometry = new T.BufferGeometry();
        let v0 = [0,0,0];
        let v1 = [0,0,-3.5];
        let v2 = [-.5,0,-3.5];
        let v3 = [-.5,0,0];
        let v4 = [0,1,0];
        let v5 = [0,1,-3.5];
        let v6 = [-.5,1,-3.5];
        let v7 = [-.5,1,0];
        let vert = [];

        //front
        vert.push(...v7);
        vert.push(...v3);
        vert.push(...v0);
        vert.push(...v0);
        vert.push(...v4);
        vert.push(...v7);
        //right
        vert.push(...v4);
        vert.push(...v0);
        vert.push(...v1);
        vert.push(...v1);
        vert.push(...v5);
        vert.push(...v4);
        //left
        vert.push(...v6);
        vert.push(...v2);
        vert.push(...v3);
        vert.push(...v3);
        vert.push(...v7);
        vert.push(...v6);
        //top
        vert.push(...v6);
        vert.push(...v7);
        vert.push(...v4);
        vert.push(...v4);
        vert.push(...v5);
        vert.push(...v6);
        //bottom
        vert.push(...v1);
        vert.push(...v0);
        vert.push(...v3);
        vert.push(...v3);
        vert.push(...v2);
        vert.push(...v1);
        //back
        vert.push(...v5);
        vert.push(...v1);
        vert.push(...v2);
        vert.push(...v2);
        vert.push(...v6);
        vert.push(...v5);
        let vertices = new Float32Array([...vert]);
        geometry.setAttribute('position', new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();
        let uvs = new Float32Array([
            //front
            845/1024, 769/1024,
            845/1024, 574/1024, 
            975/1024, 574/1024, 
            
            975/1024, 574/1024, 
            975/1024, 769/1024, 
            845/1024, 769/1024, 
            
            //left
            80/1024, 534/1024, 
            35/1024, 340/1024, 
            775/1024, 340/1024, 

            775/1024, 340/1024, 
            775/1024, 534/1024, 
            80/1024, 534/1024, 

            30/1024, 769/1024, 
            30/1024, 574/1024, 
            770/1024, 574/1024, 
            
            //right
            770/1024, 574/1024, 
            720/1024, 769/1024, 
            30/1024, 769/1024, 

            //top
            650/1024, 230/1024, 
            
            50/1024, 230/1024, 
            50/1024, 50/1024, 
            

            50/1024, 50/1024, 
            
            650/1024, 50/1024, 
            650/1024, 230/1024, 

            //bottom
            0,1,
            0,800/1024, 
            1,800/1024,
            
            1,800/1024, 
            1,1,
            0,1,

            //back
            845/1024, 534/1024, 
            845/1024, 340/1024, 
            975/1024, 340/1024, 

            975/1024, 340/1024, 
            975/1024, 534/1024, 
            845/1024, 534/1024 


        ])
        geometry.setAttribute('uv', new T.BufferAttribute(uvs,2));
        let t1 = new T.TextureLoader().load("./textures/bus.jpg");
        let material = new T.MeshStandardMaterial({
            color:'white',
            metalness:.7,
            roughness: .2,
            map:t1
        })
        let busbody = new T.Mesh(geometry,material);
        busbody.translateY(.1);
        let group = new T.Group();
        group.add(busbody);

        let wheel1 = new T.TorusGeometry(.12,.05,16,12);
        let tiremat = new T.MeshStandardMaterial({
            color:'black',
            roughness: .9,
            metalness: .6
        })
        let tire1m = new T.Mesh(wheel1,tiremat);
        tire1m.translateY(.15)
        tire1m.rotateY(Math.PI/2);
        tire1m.translateX(.65);
        let t2 = tire1m.clone();
        group.add(tire1m);  
        t2.translateZ(-.5);
        group.add(t2);

        let t3 = tire1m.clone();
        group.add(t3);
        t3.translateX(1.725);
        let t5 = t3.clone();
        group.add(t5);
        t5.translateZ(-.5);
        let t4 = tire1m.clone();
        group.add(t4);
        t4.translateX(2.1);
        let t6 = t4.clone();
        t6.translateZ(-.5);
        group.add(t6);
        
        super('bus',group);
        this.whole_ob = group;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.y = params.rotation ? Number(params.rotation) : 0;
        let size = params.size?params.size:1;
        this.whole_ob.scale.set(size,size,size);
    }
};      

let birdCount = 0;
export class Bird extends GrObject{ 
    constructor(params = {}){
        let b1 = new T.CylinderGeometry(.1,.5,.7);
        let b2 = new T.CylinderGeometry(.5,.6,.1);
        let b3 = new T.CylinderGeometry(.6,.7,.4);
        let b4 = new T.CylinderGeometry(.7,.7,1.6);
        let b5 = new T.CylinderGeometry(.7,.5,.4);
        let b6 = new T.CylinderGeometry(.5,.3,.3);

        let bkMat = new MeshStandardMaterial({color:'gold', metalness:.6, roughness:.4});
        let bdMat = new MeshStandardMaterial({color:'black', metalness:.6, roughness:.1});
        let bwMat = new MeshStandardMaterial({color:'black', metalness:.6, roughness:.1, side: T.DoubleSide});

        let bm1 = new T.Mesh(b1,bkMat);
        let bm2 = new T.Mesh(b2,bdMat);
        let bm3 = new T.Mesh(b3,bdMat);
        let bm4 = new T.Mesh(b4,bdMat);
        let bm5 = new T.Mesh(b5,bdMat);
        let bm6 = new T.Mesh(b6,bdMat);

        bm6.translateY(.15);
        bm5.translateY(.5);
        bm4.translateY(1.5);
        bm3.translateY(2.5);
        bm2.translateY(2.75);
        bm1.translateY(3.15);

        let bird = new T.Group();
        bird.add(bm1);
        bird.add(bm2);
        bird.add(bm3);
        bird.add(bm4);
        bird.add(bm5);
        bird.add(bm6);
        
        let rwing = new T.BufferGeometry();
        let rwingV = new Float32Array( [
            .68,.7,0,   .68,2.3,0,   2.5,1.5,0
        ]);
        rwing.setAttribute('position', new T.BufferAttribute(rwingV,3));
        rwing.computeVertexNormals();
        let rightWing = new T.Mesh(rwing,bwMat);
        bird.add(rightWing);

        let lwing = new T.BufferGeometry();
        let lwingV = new Float32Array( [
            -.68,.7,0,   -.68,2.3,0,   -2.5,1.5,0
        ]);
        lwing.setAttribute('position', new T.BufferAttribute(lwingV,3));
        lwing.computeVertexNormals();
        let leftWing = new T.Mesh(lwing,bwMat);
        bird.add(leftWing);
        bird.scale.set(.1,.1,.1)
        bird.rotateX(PI/2);
        let bgroup = new T.Group();
        bgroup.add(bird);
        super(`bird${birdCount++}`,bgroup);
        this.whole_ob = bgroup;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.angle = params.angle ? Number(params.angle) : 0;
        this.lastAngle = 0;
        this.totalTime = 0;
        this.turnFlag = false;
        this.left = leftWing;
        this.right = rightWing
        this.flapFlag = 1;
        if(params.ride?Boolean(params.ride) : false){
            this.rideable = bm1;
        }
    }
    
    stepWorld(delta){
        this.totalTime+=delta;
        if(this.right.rotation.y>PI/6 ){
            this.flapFlag = -1;
        } else if(this.right.rotation.y<-PI/6) {
            this.flapFlag = 1;
        }
        //each side does the smae thing, so only need to check one
        this.right.rotateY(this.flapFlag*delta/300)
        this.left.rotateY(-this.flapFlag*delta/300)

        



        //noise btwn 1 and 10
        
        let rand = (Math.random()*10-5)*2;
        this.whole_ob.translateZ(delta/1000);
        this.whole_ob.rotation.y = this.angle;
        this.angle += rand/(100*PI);//max random angle is 9 degrees
        this.angle = this.angle%(2*PI)//book keeping
        if(Math.abs(this.whole_ob.position.x)>20 && !this.turnFlag){//turn around routine
            this.angle = 2*PI-this.angle;
            this.turnFlag = true;
        }
        if(Math.abs(this.whole_ob.position.z)>20&& !this.turnFlag){//turn around routine
            this.angle = PI-this.angle;
            
            this.turnFlag = true
        }
        if(this.turnFlag && Math.abs(this.whole_ob.position.z)<20 && Math.abs(this.whole_ob.position.x)<20){
            this.turnFlag = false;
        }
    }
}

export class Flag extends GrObject{
    constructor(params = {}){
        let segs = [];
        let poleg = new CylinderGeometry(.1,.1,5);
        let pole = new Mesh(poleg, new MeshStandardMaterial({color:'silver'}));
        pole.translateY(2.5)
        let cloth = new T.Group();
        let clg = new T.BoxGeometry(.1,1,.1);
        cloth.translateY(4.5);
        cloth.translateX(.15);
        let c1 = new Mesh(clg, new MeshStandardMaterial({color:'red'}));
        let c2 = new Mesh(clg, new MeshStandardMaterial({color:'red'}));
        let c3 = new Mesh(clg, new MeshStandardMaterial({color:'orange'}));
        let c4 = new Mesh(clg, new MeshStandardMaterial({color:'orange'}));
        let c5 = new Mesh(clg, new MeshStandardMaterial({color:'yellow'}));
        let c6 = new Mesh(clg, new MeshStandardMaterial({color:'yellow'}));
        let c7 = new Mesh(clg, new MeshStandardMaterial({color:'green'}));
        let c8 = new Mesh(clg, new MeshStandardMaterial({color:'green'}));
        let c9 = new Mesh(clg, new MeshStandardMaterial({color:'blue'}));
        let c10 = new Mesh(clg, new MeshStandardMaterial({color:'blue'}));
        let c11 = new Mesh(clg, new MeshStandardMaterial({color:'purple'}));
        let c12 = new Mesh(clg, new MeshStandardMaterial({color:'purple'}));
        cloth.add(c1);
        cloth.add(c2);
        c2.translateX(.1);
        cloth.add(c3);
        c3.translateX(.2);
        cloth.add(c4);
        c4.translateX(.3);
        cloth.add(c5);
        c5.translateX(.4);
        cloth.add(c6);
        c6.translateX(.5);
        cloth.add(c7);
        c7.translateX(.6);
        cloth.add(c8);
        c8.translateX(.7);
        cloth.add(c9);
        c9.translateX(.8);
        cloth.add(c10);
        c10.translateX(.9);
        cloth.add(c11);
        c11.translateX(1);
        cloth.add(c12);
        c12.translateX(1.1);
        segs.push(c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12);
        let mesh = new T.Group();
        mesh.add(pole);
        mesh.add(cloth);
        super('flag',mesh)
        this.segs = segs;
        this.interp = [2*PI/12,2*2*PI/12,3*2*PI/12,4*2*PI/12,5*2*PI/12,6*2*PI/12,7*2*PI/12,8*2*PI/12,9*2*PI/12,10*2*PI/12,11*2*PI/12,12*2*PI/12,];
        this.whole_ob = mesh;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.angle = 0;
    
        
    }
    stepWorld(delta, timeOfDay){
        
        for(let i = 0; i < this.segs.length; i++){
          this.segs[i].position.z = .06*(Math.sin(this.interp[i])-Math.sin(this.interp[i])*Math.sin(this.interp[i])+Math.cos(this.interp[i])*Math.sin(this.interp[i]) +.5);
          this.interp[i] += delta*.001*Math.PI
        }
        this.angle += delta*.0005*Math.PI
        this.whole_ob.rotation.y += .005*(Math.pow(Math.sin(this.angle),2) - 1/4 * Math.sin(this.angle))
      }
}

export class Lake extends GrObject{
    constructor(params = {}){
        let curve = new T.Shape();
        curve.moveTo(-20,5);

            curve.bezierCurveTo(-10,0,  -12,0,  -10.333333,-6.666667)
            curve.bezierCurveTo(-8.666666,-13.3333333, -12,-15, -6.6666666,-16);
            curve.bezierCurveTo(-1.3333,-17, -2,-17, 0,-20);
              
        //2/3 of the way
        

        curve.lineTo(0,-20);
        curve.lineTo(-20,-20);
        curve.lineTo(-20,5);

        let geom = new T.ExtrudeGeometry(curve,{steps:1, depth:.01, bevelEnabled:false});
        let material = new T.MeshStandardMaterial({ color: 'lightblue', metalness:.9, roughness: .2});
        let mesh = new T.Mesh(geom, material);
        mesh.rotateX(-PI/2)
        mesh.translateY(.01);
        super('lake', mesh);
    }
}

let OakCount = 0;

export class OakTree extends GrObject{
    constructor(params = {}){
        let width = 1.5;
        let segments = [];
        let tree = new T.Group();
        let lMat = new T.MeshStandardMaterial({color:'green'});
        //make geometry
        //5 trunk segments, 4 tree segments + cone on top
        let T1Geom = new T.CylinderGeometry(width*.5*.6, width*.65*.6,1);
        let t1Mesh = new T.Mesh(T1Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
        tree.add(t1Mesh);
        t1Mesh.translateY(.5);
        segments.push(t1Mesh);

        let T2Geom = new T.CylinderGeometry(width*.4*.6, width*.5*.6,1);
        let t2Mesh = new T.Mesh(T2Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
        t1Mesh.add(t2Mesh);
        t2Mesh.translateY(1);
        segments.push(t2Mesh);

        let T3Geom = new T.CylinderGeometry(width*.35*.6, width*.4*.6,1);
        let t3Mesh = new T.Mesh(T3Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
        t2Mesh.add(t3Mesh);
        t3Mesh.translateY(1);
        segments.push(t3Mesh);
        
        let T4 = new T.Group();
        let s4 = new T.SphereGeometry(width*.4);
        
        let sm41 = new T.Mesh(s4,lMat);
        let sm42 = new T.Mesh(s4,lMat);
        let sm43 = new T.Mesh(s4,lMat);
        let spacing = params.width ? Number(params.width) : 3.5;
        sm41.translateX(width*.4*.5*spacing*.5);
        sm41.translateZ(width*.4*.5*spacing*.288);
        sm42.translateX(-width*.4*.5*spacing*.5);
        sm42.translateZ(width*.4*.5*spacing*.288);
        sm43.translateZ(-width*.4*.5*spacing*.577);
        T4.add(sm41);
        T4.add(sm42);
        T4.add(sm43);
        let t4g = new T.Group();
        t4g.add(T4);
        t3Mesh.add(t4g);
        t4g.translateY(.3*width);
        let T5 = T4.clone();
        let T6 = T4.clone();
        let T7 = T4.clone();
        let T8 = T4.clone();
        let t5g = new T.Group();
        t4g.add(t5g);
        t5g.add(T5);
        t5g.translateY(width*.4);
        T5.rotateY(PI/3);
        T5.scale.set(1.3,1.3,1.3);
        let t6g = new T.Group();
        t5g.add(t6g);
        t6g.add(T6);
        t6g.translateY(width*.4+width*.4*1.2-1)
        T6.scale.set(1.3,1.3,1.3);
        let t7g = new T.Group();
        t6g.add(t7g);
        t7g.add(T7);
        T7.rotateY(PI/3);
        t7g.translateY(width*.4+width*.4*1.2-1)
        let t8g = new T.Group();
        t7g.add(t8g);
        t8g.add(T8);
        t8g.translateY(width*.4+width*.4*1.2-1);
        T8.scale.set(1,1,1);
        let Tg9 = new T.SphereGeometry(.3*width);
        let T9 = new T.Mesh(Tg9,lMat);
        t8g.add(T9);
        T9.translateY(.5);
        segments.push(t4g,t5g,t6g,t7g,t8g,T9);
        tree.scale.set(.4,.4,.4);
        
              

        super(`OakTree${OakCount++}`,tree);

        this.whole_ob = tree;
        //this.segments = segments;
  
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.segments = segments;
        this.angle = 0;
        let scale = params.size ? Number(params.size) : 1;
        tree.scale.set(tree.scale.x*scale, tree.scale.y*scale, tree.scale.z*scale);
      }
      
      stepWorld(delta, timeOfDay){
        this.angle += delta*.0005*Math.PI
        for(let i = 0; i < this.segments.length; i++){
          this.segments[i].position.x = .08*(Math.pow(Math.sin(this.angle),2) - 1/4 * Math.sin(this.angle))
        }
        this.whole_ob.rotation.y += .005*(Math.pow(Math.sin(this.angle),2) - 1/4 * Math.sin(this.angle))
      }
    
}

let treeObCtr = 0;

export class GrTree extends GrObject{

    constructor(params = {} ) {
      let width = 1.5;
      let segments = [];
      let tree = new T.Group();

      //make geometry
      //5 trunk segments, 4 tree segments + cone on top
      let T1Geom = new T.CylinderGeometry(width*.5, width*.65,1);
      let t1Mesh = new T.Mesh(T1Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
      tree.add(t1Mesh);
      t1Mesh.translateY(.5);
      segments.push(t1Mesh);

      let T2Geom = new T.CylinderGeometry(width*.4, width*.5,1);
      let t2Mesh = new T.Mesh(T2Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
      t1Mesh.add(t2Mesh);
      t2Mesh.translateY(1);
      segments.push(t2Mesh);

      let T3Geom = new T.CylinderGeometry(width*.35, width*.4,1);
      let t3Mesh = new T.Mesh(T3Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
      t2Mesh.add(t3Mesh);
      t3Mesh.translateY(1);
      segments.push(t3Mesh);

      let T4Geom = new T.CylinderGeometry(width*.4, width*.35,1);
      let t4Mesh = new T.Mesh(T4Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
      t3Mesh.add(t4Mesh);
      t4Mesh.translateY(1);
      segments.push(t4Mesh);

      let T5Geom = new T.CylinderGeometry(width*.5, width*.4,1);
      let t5Mesh = new T.Mesh(T5Geom, new T.MeshStandardMaterial({color:"#4b3621"}))
      t4Mesh.add(t5Mesh);
      t5Mesh.translateY(1);
      segments.push(t5Mesh);

      let l2Geom = new T.CylinderGeometry(width, width*.5,1);
      let l2Mesh = new T.Mesh(l2Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      t5Mesh.add(l2Mesh);
      l2Mesh.translateY(1);
      segments.push(l2Mesh);

      let l3Geom = new T.CylinderGeometry(width*1.2, width,1);
      let l3Mesh = new T.Mesh(l3Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      l2Mesh.add(l3Mesh);
      l3Mesh.translateY(1);
      segments.push(l3Mesh);
      
      let l4Geom = new T.CylinderGeometry(width*1.3, width*1.2,1);
      let l4Mesh = new T.Mesh(l4Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      l3Mesh.add(l4Mesh);
      l4Mesh.translateY(1);
      segments.push(l4Mesh);
      
      let l1Geom = new T.CylinderGeometry(width*1.2, width*1.3,1);
      let l1Mesh = new T.Mesh(l1Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      l4Mesh.add(l1Mesh);
      l1Mesh.translateY(1);
      segments.push(l1Mesh);

      let l5Geom = new T.CylinderGeometry(width, width*1.2,1);
      let l5Mesh = new T.Mesh(l5Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      l1Mesh.add(l5Mesh);
      l5Mesh.translateY(1);
      segments.push(l5Mesh);

      let l6Geom = new T.ConeGeometry(width,1.5,16)
      let l6Mesh = new T.Mesh(l6Geom, new T.MeshStandardMaterial({color:"#2a7e19"}));
      l5Mesh.add(l6Mesh);
      l6Mesh.translateY(1.25);
      segments.push(l6Mesh);
      
      super(`Tree-${treeObCtr++}`, tree);
      this.whole_ob = tree;
      //this.segments = segments;

      this.whole_ob.position.x = params.x ? Number(params.x) : 0;
      this.whole_ob.position.y = params.y ? Number(params.y) : 0;
      this.whole_ob.position.z = params.z ? Number(params.z) : 0;
      this.segments = segments;
      this.angle = 0;
      let scale = params.size ? Number(params.size) : 1;
      tree.scale.set(scale, scale, scale);
    }
    
    stepWorld(delta, timeOfDay){
      this.angle += delta*.0005*Math.PI
      for(let i = 0; i < this.segments.length; i++){
        this.segments[i].position.x = .08*(Math.pow(Math.sin(this.angle),2) - 1/4 * Math.sin(this.angle))
      }
      this.whole_ob.rotation.y += .005*(Math.pow(Math.sin(this.angle),2) - 1/4 * Math.sin(this.angle))
    }
}

// A colorful merry-go-round, with handles and differently-colored sections.
/**
 * @typedef ColoredRoundaboutProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
let roundaboutObCtr = 0;
export class GrColoredRoundabout extends GrObject {
    /**
     * @param {ColoredRoundaboutProperties} params
     */
    constructor(params = {}) {
      let roundabout = new T.Group();
  
      let base_geom = new T.CylinderGeometry(0.5, 1, 0.5, 16);
      let base_mat = new T.MeshStandardMaterial({
        color: "#888888",
        metalness: 0.5,
        roughness: 0.8
      });
      let base = new T.Mesh(base_geom, base_mat);
      base.translateY(0.25);
      roundabout.add(base);
  
      let platform_group = new T.Group();
      base.add(platform_group);
      platform_group.translateY(0.25);
  
      let section_geom = new T.CylinderGeometry(
        2,
        1.8,
        0.3,
        8,
        4,
        false,
        0,
        Math.PI / 2
      );
      let section_mat;
      let section;
  
      let handle_geom = buildHandle();
      let handle_mat = new T.MeshStandardMaterial({
        color: "#999999",
        metalness: 0.8,
        roughness: 0.2
      });
      let handle;
  
      // in the loop below, we add four differently-colored sections, with handles,
      // all as part of the platform group.
      let section_colors = ["red", "blue", "yellow", "green"];
      for (let i = 0; i < section_colors.length; i++) {
        section_mat = new T.MeshStandardMaterial({
          color: section_colors[i],
          metalness: 0.3,
          roughness: 0.6
        });
        section = new T.Mesh(section_geom, section_mat);
        handle = new T.Mesh(handle_geom, handle_mat);
        section.add(handle);
        handle.rotation.set(0, Math.PI / 4, 0);
        handle.translateZ(1.5);
        platform_group.add(section);
        section.rotateY((i * Math.PI) / 2);
      }
  
      // note that we have to make the Object3D before we can call
      // super and we have to call super before we can use this
      super(`Roundabout-${roundaboutObCtr++}`, roundabout);
      this.whole_ob = roundabout;
      this.platform = platform_group;
  
      // put the object in its place
      this.whole_ob.position.x = params.x ? Number(params.x) : 0;
      this.whole_ob.position.y = params.y ? Number(params.y) : 0;
      this.whole_ob.position.z = params.z ? Number(params.z) : 0;
      let scale = params.size ? Number(params.size) : 1;
      roundabout.scale.set(scale, scale, scale);
  
      // This helper function defines a curve for the merry-go-round's handles,
      // then extrudes a tube along the curve to make the actual handle geometry.
      function buildHandle() {
        /**@type THREE.CurvePath */
        let handle_curve = new T.CurvePath();
        handle_curve.add(
          new T.LineCurve3(new T.Vector3(-0.5, 0, 0), new T.Vector3(-0.5, 0.8, 0))
        );
        handle_curve.add(
          new T.CubicBezierCurve3(
            new T.Vector3(-0.5, 0.8, 0),
            new T.Vector3(-0.5, 1, 0),
            new T.Vector3(0.5, 1, 0),
            new T.Vector3(0.5, 0.8, 0)
          )
        );
        handle_curve.add(
          new T.LineCurve3(new T.Vector3(0.5, 0.8, 0), new T.Vector3(0.5, 0, 0))
        );
        return new T.TubeGeometry(handle_curve, 64, 0.1, 8);
      }
    }
    /**
     * StepWorld Method
     * @param {*} delta 
     * @param {*} timeOfDay 
     */
    stepWorld(delta, timeOfDay) {
      this.platform.rotateY(0.003 * delta);
    }
  }

export class GableRoof extends GrObject {
    constructor(params = {}) {
        let geometry = new T.BufferGeometry();
        let v0 = [0,0,0];
        let v1 = [0,0,-1];
        let v2 = [-1,0,-1];
        let v3 = [-1,0,0];
        let v4 = [0,1,0];
        let v5 = [0,1,-1];
        let v6 = [-1,1,-1];
        let v7 = [-1,1,0];
        let v8 = [-.5,1.5,0];
        let v9 = [-.5,1.5,-1]; 
        
        let vert = [];

        //front
        vert.push(...v4); vert.push(...v0); vert.push(...v1);
        vert.push(...v1); vert.push(...v5); vert.push(...v4);

        //left
        vert.push(...v7); vert.push(...v3); vert.push(...v0);
         vert.push(...v0); vert.push(...v4); vert.push(...v7);

        //right
        vert.push(...v5); vert.push(...v1); vert.push(...v2);
        vert.push(...v2);  vert.push(...v6); vert.push(...v5);

        //back
        vert.push(...v6); vert.push(...v2); vert.push(...v3);
        vert.push(...v3); vert.push(...v7); vert.push(...v6);

        //roof front
        vert.push(...v8); vert.push(...v4); vert.push(...v5);
        vert.push(...v5); vert.push(...v9); vert.push(...v8);

        //roof back
        vert.push(...v9); vert.push(...v6); vert.push(...v7);
        vert.push(...v7); vert.push(...v8); vert.push(...v9);

        //roof left
        vert.push(...v7); vert.push(...v4); vert.push(...v8);

        //roof right
        vert.push(...v5); vert.push(...v6); vert.push(...v9);

        const vertices = new Float32Array([...vert]);
        geometry.setAttribute('position', new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        let uvs = new Float32Array([
            //front
            0,.5,   0,0,    .5,0,
            .5,0,   .5,.5,  0,.5,

            //left  
            .5,.5,  .5,0,   1,0,
            1,0,    1,.5,   .5,.5,
            //right
            .5,.5,  .5,0,   1,0,
            1,0,    1,.5,   .5,.5,

            //back
            .5,.5,  .5,0,   1,0,
            1,0, 1,.5, .5,.5,

            //roof front
            .5,1, .5,.5, 1,.5,
            1,.5, 1,1, .5,1,
            //roof back
            .5,1, .5,.5, 1,.5,
            1,.5, 1,1, .5,1,
            //roof left
            .5,0, 1,0, .75,.25,
            
            //roof right
            .5,0, 1,0, .75,.25,
            
        ]);

        geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));
        let t1 = new T.TextureLoader().load("./textures/mine.png");


        let material =new T.MeshStandardMaterial({
            color:'white',
            roughness: .75,
            map:t1
        })
        let mesh = new T.Mesh(geometry,material);
        super('gable_roof', mesh);
        this.whole_ob = mesh;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.y = params.rotation ? Number(params.rotation) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale,scale,scale);
    }
}

export class HipRoof extends GrObject {
    constructor(params = {}) {
        let geometry = new T.BufferGeometry();
        let v0 = [0,0,0];
        let v1 = [0,0,-1];
        let v2 = [-1,0,-1];
        let v3 = [-1,0,0];
        let v4 = [0,1,0];
        let v5 = [0,1,-1];
        let v6 = [-1,1,-1];
        let v7 = [-1,1,0];
        let v8 = [-.5,1.5,-.5];
        
        let vert = [];

        //front
        vert.push(...v4); vert.push(...v0); vert.push(...v1);
        vert.push(...v1); vert.push(...v5); vert.push(...v4);

        //left
        vert.push(...v3); vert.push(...v0); vert.push(...v4);
        vert.push(...v4); vert.push(...v7); vert.push(...v3);

        //right
        vert.push(...v5); vert.push(...v1); vert.push(...v2);
        vert.push(...v2); vert.push(...v6); vert.push(...v5);

        //back
        vert.push(...v6); vert.push(...v2); vert.push(...v3);
        vert.push(...v3); vert.push(...v7); vert.push(...v6);

        //roof front
        vert.push(...v4); vert.push(...v5); vert.push(...v8);

        //roof back
        vert.push(...v6); vert.push(...v7); vert.push(...v8);

        //roof left
        vert.push(...v7); vert.push(...v4); vert.push(...v8);

        //roof right
        vert.push(...v5); vert.push(...v6); vert.push(...v8);

        const vertices = new Float32Array([...vert]);
        geometry.setAttribute('position', new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        let uvs = new Float32Array([
            //front
            0,.5, 0,0, .5,0,
            .5,0, .5,.5, 0,.5,
            //left
            .5,.5, .5,0, 1,0,
              1,0, 1,.5, .5,.5,
            //right
            .5,.5, .5,0, 1,0,
            1,0, 1,.5, .5,.5,
            //back
            .5,.5, .5,0, 1,0,
            1,0, 1,.5, .5,.5,
            //roof front
            .5,.5, 1,.5, .75,.75,
            //roof back
            .5,.5, 1,.5, .75,.75,
            //roof left
            .5,.5, 1,.5, .75,.75,
            //roof right
            .5,.5, 1,.5, .75,.75
        ])
        geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));
        let t1 = new T.TextureLoader().load("./textures/mine.png");


        let material =new T.MeshStandardMaterial({
            color:'white',
            roughness: .75,
            map:t1
        })
        let mesh = new T.Mesh(geometry,material);
        super('hip_roof', mesh);
        this.whole_ob = mesh;
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        this.whole_ob.rotation.y = params.rotation ? Number(params.rotation) : 0;
        let scale = params.size ? Number(params.size) : 1;
        this.whole_ob.scale.set(scale,scale,scale);
    }
}
let carouselObCtr = 0;
// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
// @ts-ignore
export class GrCarousel extends GrObject {
  /**
   * @param {CarouselProperties} params
   */
  constructor(params = {}) {
    let width = 3;
    let carousel = new T.Group();

    let base_geom = new T.CylinderGeometry(width, width, 1, 32);
    let base_mat = new T.MeshStandardMaterial({
      color: "lightblue",
      metalness: 0.3,
      roughness: 0.8
    });
    let base = new T.Mesh(base_geom, base_mat);
    base.translateY(0.5);
    carousel.add(base);

    /////////////////////////////////////////////////////////////////

    let platform_group = new T.Group();
    base.add(platform_group);
    platform_group.translateY(0.5);

    /////////////////////////////////////////////////////////////////

    let platform_geom = new T.CylinderGeometry(
      0.95 * width,
      0.95 * width,
      0.2,
      32
    );
    let platform_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.3,
      roughness: 0.8
    });
    let platform = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(platform);

    /////////////////////////////////////////////////////////////////

    let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
    let cpole_mat = new T.MeshStandardMaterial({
      color: "gold",
      metalness: 0.8,
      roughness: 0.5
    });
    let cpole = new T.Mesh(cpole_geom, cpole_mat);
    //platform_group.add(cpole);
    cpole.translateY(1.5);

    /////////////////////////////////////////////////////////////////

    let top_trim = new T.Mesh(platform_geom, platform_mat);
    platform_group.add(top_trim);
    top_trim.translateY(3);

    /////////////////////////////////////////////////////////////////
    // this is the pole geometry
    /////////////////////////////////////////////////////////////////

    let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
    let opole_mat = new T.MeshStandardMaterial({
      color: "#aaaaaa",
      metalness: 0.8,
      roughness: 0.5
    });
    let horseTorso = new T.CylinderGeometry(.1*width, .1*width, .3*width);
    let horseTorsoMat = new T.MeshStandardMaterial({ color: "#3d0c02", metalness:.5, roughness: .8});
    let horseLeg = new T.CylinderGeometry(.01*width,.02*width,.3*width)
    let horseNeck = new T.CylinderGeometry(.01*width,.01*width,.2*width)
    let horseHead = new T.CylinderGeometry(.05*width,.05*width,.1*width);
    let opole;
    let num_poles = 10;
    let poles = [];
    let horse;
    let horses = [];
    let cycles = [];
    let flag = true;
    let tmp;
    for (let i = 0; i < num_poles; i++) {
      opole = new T.Mesh(opole_geom, opole_mat);
      horse = new T.Mesh(horseTorso, horseTorsoMat);
      platform_group.add(opole);
      platform_group.add(horse);

      let leg = new T.Mesh(horseLeg, horseTorsoMat);
      horse.add(leg);
      leg.rotateX(Math.PI/2);
      leg.translateZ(.12*width);
      let leg2 = leg.clone();
      let leg3 = leg.clone();
      leg3.translateZ(-.24*width);
      let leg4 = leg3.clone();
      leg.rotateZ(Math.PI/6);
      leg.translateY(.15*width) 

      
      leg2.rotateZ(-Math.PI/6);
      leg2.translateY(.15*width);
      horse.add(leg2);

      leg3.rotateZ(Math.PI/6);
      leg3.translateY(.15*width);
      horse.add(leg3);

      leg4.rotateZ(-Math.PI/6);
      leg4.translateY(.15*width);
      horse.add(leg4);

      let neck = new T.Mesh(horseNeck,horseTorsoMat);
      horse.add(neck);
      neck.rotateX(Math.PI/2);
      neck.translateY(-.15*width)
      neck.translateZ(.135*width);

      let head = new T.Mesh(horseHead,horseTorsoMat);
      neck.add(head);
      head.translateY(-.1*width)
      head.translateZ(.01*width);
      head.rotateX(Math.PI/2);
      if(flag){
        flag = false;
        tmp = neck.rotateZ(PI);
        }

      let snout = new T.Mesh(new T.CylinderGeometry(.02*width,.05*width,.05*width), horseTorsoMat)
      head.add(snout);
      //snout.rotateX(Math.PI/2);
      snout.translateY(.075*width);


      opole.translateY(1.5);
      opole.rotateY((2 * i * Math.PI) / num_poles);
      opole.translateX(0.8 * width);
      poles.push(opole);

      horse.rotateX(Math.PI/2);
      horse.translateZ(-1.5);
      //every coord system is rotated a bit
      horse.rotateZ((2 * i * Math.PI) / num_poles);
      horse.translateX(0.8 * width);
      cycles.push(2*Math.PI*Math.random());      
      horses.push(horse);
    }

    
  /////////////////////////////////////////////////////////////////

    let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
    let roof = new T.Mesh(roof_geom, base_mat);
    carousel.add(roof);
    roof.translateY(4.8);

    /////////////////////////////////////////////////////////////////

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Carousel`, carousel);
    this.rideable = tmp;
    this.whole_ob = carousel;
    this.platform = platform_group;
    this.poles = poles;
    this.horses = horses;
    this.cycles = cycles;
    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    carousel.scale.set(scale, scale, scale);
  }
  stepWorld(delta, timeOfDay) {
      for(let i = 0; i < this.horses.length; i++){
        this.cycles[i] += .0008*delta;
        this.horses[i].position.y = 1.5+(Math.sin(this.cycles[i])*.5)
      }
      this.platform.rotateY(.0006*delta);
  }
}

let swingObCtr = 0;

// A more complicated, one-seat swingset.
// This one has actual chain links for its chains,
// and uses a nicer animation to give a more physically-plausible motion.
/**
 * @typedef AdvancedSwingProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 * @property {number} [speed=1]
 * @property {number} [arcSize=1]
 */
export class GrAdvancedSwing extends GrObject {
  /**
   * @param {AdvancedSwingProperties} params
   */
  constructor(params = {}) {
    let swing = new T.Group();
    addPosts(swing);

    let hanger = new T.Group();
    swing.add(hanger);
    hanger.translateY(1.8);
    let l_chain = new T.Group();
    let r_chain = new T.Group();
    hanger.add(l_chain);
    hanger.add(r_chain);
    // after creating chain groups, call the function to add chain links.
    growChain(l_chain, 20);
    growChain(r_chain, 20);
    l_chain.translateZ(0.4);
    r_chain.translateZ(-0.4);

    let seat_group = new T.Group();
    let seat_geom = new T.BoxGeometry(0.4, 0.1, 1);
    let seat_mat = new T.MeshStandardMaterial({
      color: "#554433",
      metalness: 0.1,
      roughness: 0.6
    });
    let seat = new T.Mesh(seat_geom, seat_mat);
    seat_group.add(seat);
    seat_group.position.set(0, -1.45, 0);
    hanger.add(seat_group);

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    super(`Swing-${swingObCtr++}`, swing);
    this.whole_ob = swing;
    this.hanger = hanger;
    this.seat = seat_group;
    this.speed = params.speed || 1;
    this.arcSize = params.arcSize || 1;

    // put the object in its place
    this.whole_ob.position.x = params.x ? Number(params.x) : 0;
    this.whole_ob.position.y = params.y ? Number(params.y) : 0;
    this.whole_ob.position.z = params.z ? Number(params.z) : 0;
    let scale = params.size ? Number(params.size) : 1;
    swing.scale.set(scale, scale, scale);

    this.swing_angle = 0;

    // This helper function creates the 5 posts for a swingset frame,
    // and positions them appropriately.
    function addPosts(group) {
      let post_material = new T.MeshStandardMaterial({
        color: "red",
        metalness: 0.6,
        roughness: 0.5
      });
      let post_geom = new T.CylinderGeometry(0.1, 0.1, 2, 16);
      let flPost = new T.Mesh(post_geom, post_material);
      group.add(flPost);
      flPost.position.set(0.4, 0.9, 0.9);
      flPost.rotateZ(Math.PI / 8);
      let blPost = new T.Mesh(post_geom, post_material);
      group.add(blPost);
      blPost.position.set(-0.4, 0.9, 0.9);
      blPost.rotateZ(-Math.PI / 8);
      let frPost = new T.Mesh(post_geom, post_material);
      group.add(frPost);
      frPost.position.set(0.4, 0.9, -0.9);
      frPost.rotateZ(Math.PI / 8);
      let brPost = new T.Mesh(post_geom, post_material);
      group.add(brPost);
      brPost.position.set(-0.4, 0.9, -0.9);
      brPost.rotateZ(-Math.PI / 8);
      let topPost = new T.Mesh(post_geom, post_material);
      group.add(topPost);
      topPost.position.set(0, 1.8, 0);
      topPost.rotateX(-Math.PI / 2);
    }

    // Helper function to add "length" number of links to a chain.
    function growChain(group, length) {
      let chain_geom = new T.TorusGeometry(0.05, 0.015);
      let chain_mat = new T.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.8,
        roughness: 0.2
      });
      let link = new T.Mesh(chain_geom, chain_mat);
      group.add(link);
      for (let i = 0; i < length; i++) {
        let l_next = new T.Mesh(chain_geom, chain_mat);
        l_next.translateY(-0.07);
        link.add(l_next);
        l_next.rotation.set(0, Math.PI / 3, 0);
        link = l_next;
      }
    }
  }
  /**
   * StepWorld method
   * @param {*} delta 
   * @param {*} timeOfDay 
   */
  stepWorld(delta, timeOfDay) {
    // in this animation, use the sine of the accumulated angle to set current rotation.
    // This means the swing moves faster as it reaches the bottom of a swing,
    // and faster at either end of the swing, like a pendulum should.
    this.swing_angle += 0.005 * delta * this.speed;
    this.hanger.rotation.z = this.arcSize * (Math.sin(this.swing_angle) * Math.PI) / 4;
    this.seat.rotation.z = this.arcSize * (Math.sin(this.swing_angle) * Math.PI) / 16;
  }

}

