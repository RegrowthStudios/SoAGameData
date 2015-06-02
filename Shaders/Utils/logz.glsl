uniform float unZCoef; // Should be 2.0 / log2(ZFAR + 1.0)

// Call this after setting up gl_Position with projection multiply
void applyLogZ() {
    gl_Position.z = log2(max(0.0001, gl_Position.w + 1.0)) * unZCoef - 1.0;
    gl_Position.z *= gl_Position.w;
}
