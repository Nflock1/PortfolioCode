/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { GrCarousel, GableRoof, HipRoof, DirtPath, Tent, Bird, OakTree, GrTree, Flag, Lake, GrColoredRoundabout, GrAdvancedSwing, GrSkidLoader, GrDumpTruck, Mound, Bus } from "./objects.js";
import { FbxGrObject } from "../libs/CS559-Framework/loaders.js";

const PI = 3.1415926535;
/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20 // make the ground plane big enough for a world of stuff
});

const loader = new FbxGrObject({fbx:"./textures/source/PortaPotty.fbx", name:"PortaPotty"});

loader.objects[0].translateY(1)
loader.objects[0].translateZ(-8)
loader.setScale(.007,.007,.007);
 world.add(loader);       

// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
//main(world);
let test = new HipRoof({x:-9, z:-10, size:2});
world.add(test);
let build = new GableRoof({x:-7, z: -12, size:2, rotation: -PI/2})
world.add(build);

let admin = new GableRoof({x:-4, z: -12, size:3, rotation: -PI})
world.add(admin);

let path = new DirtPath();
world.add(path);
path.objects[0].rotateX(PI/2);

let tent1 = new Tent({color:"red", x:17,z:-7});
let tent2 = new Tent({color: "blue", x:16,z:-3,rotation:PI});
let tent3 = new Tent({color: "yellow", rotation:-3*PI/4, x:19,z:-4});
let tent4 = new Tent({color:"#ef1de7", rotation:-PI/2, x:13,z:-15});
let tent5 = new Tent({color: "#ef1de7",rotation:-PI/2, x:13,z:-13});

world.add(tent1);
world.add(tent2);
world.add(tent3);
world.add(tent4);
world.add(tent5);

let bus = new Bus({x:10,z:-11, size:2.5});
world.add(bus);

let bird1 = new Bird({y:8,z:0, angle: Math.random()*2*PI, ride:true})
let bird2 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird3 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird4 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird5 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird6 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird7 = new Bird({y:8,z:0, angle: Math.random()*2*PI})
let bird8 = new Bird({y:8,z:0, angle: Math.random()*2*PI})

world.add(bird1);
world.add(bird2);
world.add(bird3);
world.add(bird4);
world.add(bird5);
world.add(bird6);
world.add(bird7);
world.add(bird8);

let oak = new OakTree({x:15,z:2, size:1.5});
let oak1 = new OakTree({x:13,z:8, size:1.5});
let oak2 = new OakTree({x:19,z:0, size:1.7});
let oak3 = new OakTree({x:18,z:-8, size:1.6});
let oak4 = new OakTree({x:13,z:-9, size:1.5});
let oak5 = new OakTree({x:16,z:-15, size:1.5});
let oak6 = new OakTree({x:4,z:-8, size:1.5});
let oak7 = new OakTree({x:6,z:-15, size:1.5});
let oak8 = new OakTree({x:-17,z:-16, size:1.6});
let oak9 = new OakTree({x:-15,z:-5, size:1.4});
let oak10 = new OakTree({x:0,z:5, size:1.4});
let oak11 = new OakTree({x:19,z:17, size:1.4});

world.add(oak);
world.add(oak1);
world.add(oak2);
world.add(oak3);
world.add(oak4);
world.add(oak5);
world.add(oak6);
world.add(oak7);
world.add(oak8);
world.add(oak9);
world.add(oak10);
world.add(oak11);

let tree = new GrTree({x:13,z:-17,size:.3});
let tree1 = new GrTree({x:15,z:-12,size:.3});
let tree2 = new GrTree({x:13,z:2,size:.2});
let tree3 = new GrTree({x:14,z:-2,size:.25});
let tree4 = new GrTree({x:-2,z:-18,size:.35});
let tree5 = new GrTree({x:-4,z:-2,size:.3});
let tree6 = new GrTree({x:4,z:0,size:.25});
let tree7 = new GrTree({x:17,z:11,size:.3});
let tree8 = new GrTree({x:2,z:18,size:.3});
let tree9 = new GrTree({x:6,z:15,size:.3});
world.add(tree);
world.add(tree1);
world.add(tree2);
world.add(tree3);
world.add(tree4);
world.add(tree5);
world.add(tree6);
world.add(tree7);
world.add(tree8);
world.add(tree9);

let spinTheKids = new GrColoredRoundabout({size:.5, x:6, z:8});
world.add(spinTheKids);

let carousel = new GrCarousel({size:.5})
world.add(carousel);

let swing1 = new GrAdvancedSwing({size:.5, x:6, z:3})
world.add(swing1);
let swing2 = new GrAdvancedSwing({size:.5, x:6, z:4})
world.add(swing2);

let skid = new GrSkidLoader({x:15,z:15,size:.4, y:.2});
world.add(skid);

let truck = new GrDumpTruck({x:10,z:11,size:.4, y:.2, rotation:PI});
world.add(truck);

//world.add(tent1);

let flag = new Flag({x:-9,z:-8});
world.add(flag);

let lake = new Lake();
world.add(lake);

let digmound = new Mound({x:15,z:18.5, size:.16/3});
world.add(digmound);

let dumpMound = new Mound({x:-2,z:12.5, size:.22/3});
world.add(dumpMound);

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("OakTree0");
highlight("PortaPotty");
highlight("Tent0");
highlight("mound0");
highlight("bird1");
highlight("Tent0");
highlight("flag");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
