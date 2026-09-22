/* ==========================================================================
   1. Interatividade dos Modais e Filtros
   ========================================================================== */

// Abrir Modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Impede o rolamento da página ao fundo
  }
}

// Fechar Modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Fechar ao clicar fora do conteúdo do modal
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Fechar com a tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
});

// Filtragem de Cards
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Atualizar classe ativa do botão
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Inicializa o fundo 3D
  init3DBackground();
});


/* ==========================================================================
   2. Fundo Tridimensional Suave (Three.js)
   ========================================================================== */
function init3DBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Cena, Câmera e Renderizador
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Criando formas geométricas pastéis flutuantes
  const geometryList = [
    new THREE.IcosahedronGeometry(1.5, 0),
    new THREE.TorusGeometry(1.2, 0.4, 16, 100),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.TetrahedronGeometry(1.6, 0)
  ];

  // Cores Pastéis em Hexadecimal
  const colors = [0xfcd5ce, 0xd8e2dc, 0xe8dff5, 0xfcf6bd, 0xe2ece9];
  const shapes = [];

  // Criar 12 objetos espalhados pela tela
  for (let i = 0; i < 12; i++) {
    const randomGeo = geometryList[Math.floor(Math.random() * geometryList.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const material = new THREE.MeshPhongMaterial({
      color: randomColor,
      shininess: 40,
      flatShading: true,
      transparent: true,
      opacity: 0.75
    });

    const mesh = new THREE.Mesh(randomGeo, material);

    // Posições aleatórias no espaço 3D
    mesh.position.x = (Math.random() - 0.5) * 25;
    mesh.position.y = (Math.random() - 0.5) * 25;
    mesh.position.z = (Math.random() - 0.5) * 10;

    // Velocidade de rotação individual
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.01,
      rotY: (Math.random() - 0.5) * 0.01,
      floatSpeed: Math.random() * 0.005 + 0.002,
      floatOffset: Math.random() * Math.PI * 2
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  // Iluminação
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);

  // Efeito Parallax com o Mouse
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Loop de Animação
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    shapes.forEach((shape) => {
      shape.rotation.x += shape.userData.rotX;
      shape.rotation.y += shape.userData.rotY;

      // Movimento suave de flutuação vertical
      shape.position.y += Math.sin(elapsedTime * 2 + shape.userData.floatOffset) * 0.003;
    });

    // Reação suave da câmera ao mouse
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Redimensionamento de Tela
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}