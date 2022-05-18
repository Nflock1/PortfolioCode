const vec3 lightDir = vec3(0,2,0);
const vec3 base = vec3(165.0/255.0,42.0/255.0,42.0/255.0);
varying vec3 l_normal;
uniform sampler2D disMap;
varying vec2 v_uv;
void main()
{
    float displace = texture2D(disMap,v_uv).r;
    vec3 nhat = normalize(l_normal);
    vec3 lightDir = normalize(vec4(lightDir, 0)).xyz;
    float light = dot(nhat,lightDir);
    gl_FragColor = vec4(light*base,1);
}
