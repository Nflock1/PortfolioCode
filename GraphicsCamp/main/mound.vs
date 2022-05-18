varying vec2 v_uv;
uniform sampler2D disMap;
varying vec3 l_normal;
varying vec3 v_world_position;

void main(){
    //should be black and white with equal RGB
    float displace = texture2D(disMap,uv).r;

    vec3 pos = position+ displace*normal*30.0;
    vec4 world_pos = (modelMatrix*vec4(pos,1.0));
    v_world_position = world_pos.xyz;
    gl_Position = projectionMatrix*viewMatrix*world_pos;
    l_normal = (modelMatrix*vec4(normal,0)).xyz;

    v_uv = uv;
}