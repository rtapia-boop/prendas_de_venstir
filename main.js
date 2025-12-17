// ... (resto de importaciones y variables globales) ...

// ----------------------------------------------------------------
// 2. CREACIÓN Y LÓGICA DE VESTIMENTA (USANDO MODELADO CONSTRUCTIVO)
// ----------------------------------------------------------------

// Un material base para la ropa (MeshStandardMaterial es crucial para sombras y realismo)
const CLOTHING_MATERIAL = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // El color se asignará dinámicamente
    side: THREE.DoubleSide, 
    metalness: 0.1, // Baja reflectividad
    roughness: 0.8  // Superficie mate (simulando tela)
});

function createClothing(type, hexColor) {
    const color = new THREE.Color(hexColor);
    
    // Crear un nuevo material clonando el material base y asignando el color
    const material = CLOTHING_MATERIAL.clone();
    material.color.set(color);
    
    let clothingGroup = new THREE.Group();
    
    // --- CAMISA (Simulación de cuerpo con hombros definidos) ---
    if (type === 'shirt') {
        
        // 1. Torso Principal (Tronco cónico para simular el torso)
        const torsoGeometry = new THREE.CylinderGeometry(
            0.25, // Radio superior (hombros)
            0.22, // Radio inferior (cintura)
            0.65, // Altura
            16,   // Segmentos (suficientes para una curva suave)
            1,    // Altura de segmentos
            false // tapa inferior abierta
        );
        const torsoMesh = new THREE.Mesh(torsoGeometry, material);
        torsoMesh.position.set(0, 1.3, 0); 
        clothingGroup.add(torsoMesh);

        // 2. Tapa de Hombros (Para dar una curva más natural en los hombros)
        // Usamos una Esfera, pero solo la parte superior
        const shoulderCapGeometry = new THREE.SphereGeometry(0.25, 12, 12, 0, Math.PI * 2, 0, Math.PI / 4);
        const shoulderCapMesh = new THREE.Mesh(shoulderCapGeometry, material);
        shoulderCapMesh.position.set(0, 1.625, 0); // Posicionamos justo encima del torso
        clothingGroup.add(shoulderCapMesh);

        // 3. Cuello Alto (Pequeño cilindro que simula un cuello o base de solapa)
        const neckGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 10);
        const neckMesh = new THREE.Mesh(neckGeometry, material);
        neckMesh.position.set(0, 1.67, 0); 
        clothingGroup.add(neckMesh);
        
        // 4. Mangas (Más definidas, ligeramente curvadas en los extremos)
        const sleeveLength = 0.35;
        const sleeveRadius = 0.08;
        
        // Manga Derecha
        const sleeveRGeometry = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius, sleeveLength, 8);
        const sleeveRMesh = new THREE.Mesh(sleeveRGeometry, material);
        sleeveRMesh.position.set(-0.35, 1.45, 0); 
        sleeveRMesh.rotation.z = Math.PI / 2; // Rotar para que sea horizontal
        clothingGroup.add(sleeveRMesh);

        // Manga Izquierda
        const sleeveLGeometry = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius, sleeveLength, 8);
        const sleeveLMesh = new THREE.Mesh(sleeveLGeometry, material);
        sleeveLMesh.position.set(0.35, 1.45, 0);
        sleeveLMesh.rotation.z = Math.PI / 2;
        clothingGroup.add(sleeveLMesh);
        
    } 
    
    // --- PANTALÓN (Simulación cónica y tiro) ---
    else if (type === 'pants') {
        
        // 1. Cadera/Cintura (Tronco cónico ancho)
        const hipGeometry = new THREE.CylinderGeometry(
            0.28, // Radio superior (cintura)
            0.3,  // Radio inferior (caderas)
            0.2,  // Altura
            16
        );
        const hipMesh = new THREE.Mesh(hipGeometry, material);
        hipMesh.position.set(0, 1.05, 0); 
        clothingGroup.add(hipMesh);
        
        // 2. Pierna Derecha (Cilindro cónico para simular el estrechamiento al tobillo)
        const legRGeometry = new THREE.CylinderGeometry(
            0.12, // Rodilla/Muslo (más ancho)
            0.08, // Tobillo (más estrecho)
            0.8,  // Altura de la pierna
            12
        );
        const legRMesh = new THREE.Mesh(legRGeometry, material);
        // Desplazamiento clave para el "tiro"
        legRMesh.position.set(-0.15, 0.6, 0); 
        clothingGroup.add(legRMesh);

        // 3. Pierna Izquierda (Cilindro cónico)
        const legLGeometry = new THREE.CylinderGeometry(
            0.12, 
            0.08, 
            0.8,  
            12
        );
        const legLMesh = new THREE.Mesh(legLGeometry, material);
        // Desplazamiento clave para el "tiro"
        legLMesh.position.set(0.15, 0.6, 0); 
        clothingGroup.add(legLMesh);
        
        // 4. Entrepierna (Torus/dona para suavizar la unión de las piernas)
        const crotchGeometry = new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI); // Media dona
        const crotchMesh = new THREE.Mesh(crotchGeometry, material);
        crotchMesh.position.set(0, 1.0, 0);
        crotchMesh.rotation.x = Math.PI / 2; // Girar para que quede horizontal
        clothingGroup.add(crotchMesh);
    }
    
    // Asegurar que las luces y sombras funcionen en todos los componentes
    clothingGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return clothingGroup;
}