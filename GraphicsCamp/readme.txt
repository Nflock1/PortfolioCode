To run Graphics camp, simply run the html file "final-grtorwn.html" with a local server. The LiveServer extension on VSCode works well.

Description:

My town's theme is a family friendly camp site. I positioned the buildings to look like
an administrative/maintenence or help area that campers can go to. Then there is a central
playground area to help ocupy any kids, and just past that is a lake for swimming or fishing.
This camp ground is small, but it is expanding the number of camp sites as soon as some of that dirt is cleared away!


Kinds of Objects:

1.  Tent objects
2.  Oak Tree objects
3.  The birds which are flying around
4.  The skid loader
5.  The dump truck
6.  The 'normal' tree
7.  The RV parked next to pink tents
8.  The dirt path going through the campsite
9.  The lake from bezier curves
10. The flag and flagpole waving in the wind
11. The carousel
12. The gabled roof building
13. The hip roofed building

Object loaded from a model file:
Model: PortaPotty

An object with custom shader:
ShaderObj: Mound0 and Mound1 have a displacement map based on perlin noise in the vertex shader and has a base color applied with diffusive lighting (as would seem apropriate for dirt).
 

Different Behaviors:

1. Skid loader hauling dirt to dump truck
2. Dump truck driving around the campsite and dumping dirt
3. Trees which sway in the wind and move their segments relative to each other
4. flag waving in the wind where the position is dependant on complex trig function to emulate wind
5. the carousel behavior where the main part spins while the horses move up and down out of phase with each other 
6. birds spawn in the center of the map and fly off in random directions that shift thorughout their flight. 
    If they bump into an edge, they reflect off of it at the angle of incidence

Please note that the behavior of the dump truck and skid loader can get wonky if the tab is not loaded while the animation is running, 
however I have run it with the tab open for extended periods of time without issue.


Attributions:

The following objects and behaviors were taken from workbooks administered in CS 559: Computer Graphics, taught by Michael Gleicher at UW Madison
- the advances swing and its behavior (from WB07)
- the multi color round about and its behavior (from WB07)

The following objects/methods were taken from online resources:
- http://kitfox.com/projects/perlinNoiseMaker/ was used to generate a square, grayscale image of perlin noise and MS paint was used to make the borders gray for continuity in the displacement map of my mound shader.
- The PortaPotty which was an imported model: "This work is based on "Porta Potty (Low Poly Style)" (https://sketchfab.com/3d-models/porta-potty-low-poly-style-d105f73bacae47d1b3b23a00fe8f4629) by Tiko (https://sketchfab.com/tikoavp) licensed under CC-BY-SA-4.0 (http://creativecommons.org/licenses/by-sa/4.0/)" per the license agreement included by the auther and included by me in the textures folder.


