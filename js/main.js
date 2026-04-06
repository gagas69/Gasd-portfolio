/**
 * main.js — GasdProduction
 * Animations au scroll, parallax cartes, nav scroll effect
 */

/* =============================================
   1. SCROLL REVEAL
   Animate elements with class .reveal when visible
   ============================================= */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Ne plus observer une fois visible (perf)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* =============================================
   2. NAV — Effet ombre au scroll
   ============================================= */
const nav = document.querySelector('.nav');

if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = '0 2px 40px rgba(0,0,0,0.07)';
    } else {
      nav.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* =============================================
   3. SMOOTH SCROLL pour liens ancres
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =============================================
   4. PARALLAX CARTES (éventail)
   Légère rotation 3D au mouvement de la souris
   ============================================= */
const cardFan = document.querySelector('.card-fan');

if (cardFan) {
  let rafId;

  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 à 1
      const dy = (e.clientY - cy) / cy; // -1 à 1

      // Rotation légère (max 4°)
      const rotX = -dy * 3;
      const rotY =  dx * 4;

      cardFan.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  });

  // Reset au départ de la souris
  document.addEventListener('mouseleave', () => {
    cardFan.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* =============================================
   5. ACTIVE NAV LINK (surligne la page courante)
   ============================================= */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* =============================================
   6. MOBILE HAMBURGER MENU
   ============================================= */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.style.display === 'flex';

    if (isOpen) {
      navLinks.style.display = 'none';
    } else {
      // Mobile : affiche le menu en colonne
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '70px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(245,245,247,0.98)';
      navLinks.style.backdropFilter = 'blur(20px)';
      navLinks.style.padding = '20px 24px 24px';
      navLinks.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
      navLinks.style.gap = '20px';
    }
  });

  // Fermer au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.style.display = 'none';
    });
  });
}

/* =============================================
   7. ANIMATION TEXTE FLUIDE (Apparition mot par mot)
   ============================================= */
const heroTitles = document.querySelectorAll('.hero-title, .page-hero-title');

heroTitles.forEach(title => {
  // Enlever l'animation "fade up" générique
  title.style.opacity = '1';
  title.style.animation = 'none';

  const text = title.textContent.trim();
  // Transforme le texte en enlevant les balises HTML qui posent problème (comme <br>)
  title.innerHTML = text.split(/(\s+)/).map(word => {
    if (word.trim() === '') return word; // Garder les espaces
    // Enveloppe "cache-mot" et "mot-animé"
    return `<span style="display:inline-block; overflow:hidden; vertical-align:bottom; padding:0 3px;"><span class="fluid-word" style="display:inline-block; transform:translateY(110%) rotate(3deg); opacity:0; transform-origin:top left; animation:fluidWord 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;">${word}</span></span>`;
  }).join('');

  // Décaler l'apparition de chaque mot
  title.querySelectorAll('.fluid-word').forEach((word, index) => {
    word.style.animationDelay = `${0.35 + index * 0.055}s`;
  });
});

/* =============================================
   8. BOUTONS MAGNÉTIQUES
   ============================================= */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tire le bouton de 35% vers la souris
    btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    // Réactivité rapide pour suivre la souris
    btn.style.transition = 'transform 0.05s linear, box-shadow 0.3s, background 0.3s, border-color 0.3s';
  });

  btn.addEventListener('mouseleave', () => {
    // Retour élastique au centre
    btn.style.transform = `translate(0px, 0px)`;
    btn.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s, background 0.3s, border-color 0.3s';
  });
});

/* =============================================
   9. OVERLAY DOSSIER (MODAL)
   ============================================= */
window.openFolder = function(folderId, titleText) {
  const contentNode = document.getElementById('content-' + folderId);
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalTitle = document.getElementById('modalTitle');

  if (!contentNode || !modal) return;

  // Injection des données
  modalTitle.textContent = titleText;
  modalBody.innerHTML = contentNode.innerHTML;

  // Affichage
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Empêche de scroller la page en dessous
};

window.closeFolder = function() {
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');

  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = ''; // Rétablit le scroll

  // Vide l'intérieur après l'animation pour couper le son des vidéos YouTube
  setTimeout(() => {
    modalBody.innerHTML = '';
  }, 450);
};

// Fermeture avec la touche "Échap"
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.getElementById('projectModal')?.classList.contains('active')) {
      window.closeFolder();
    }
  }
});

/* =============================================
   10. HERO "EXPLOSION" IMAGES
   Affiche 5 images à gauche et 5 images à droite (0 derrière le texte)
   ============================================= */
const heroSection = document.getElementById('hero');
if (heroSection) {
  // S'assurer que hero est en position relative
  heroSection.style.position = 'relative';
  
  // Création du conteneur en arrière-plan
  const floatContainer = document.createElement('div');
  floatContainer.className = 'hero-floating-images';
  heroSection.insertBefore(floatContainer, heroSection.firstChild);

  // On utilise 10 images comme demandé ("5 d'un côté 5 de l'autre")
  const imageNames = [
    'image copy.png', 'image copy 2.png', 'image copy 3.png', 
    'image copy 4.png', 'image copy 5.png', 'image copy 6.png', 
    'image copy 7.png', 'image copy 8.png', 'image copy 9.png', 
    'image copy 10.png'
  ];

  // Coordonnées, tailles et rotations strictly FIXES pour un look parfait par défaut
  const defaultPositions = [
    { x: 6, y: 10, rot: -12, size: 65 },   // Image 1 : Gauche Haut
    { x: 88, y: 15, rot: 18, size: 55 },   // Image 2 : Droite Haut
    { x: 18, y: 24, rot: 24, size: 45 },   // Image 3 : Gauche
    { x: 76, y: 28, rot: -14, size: 75 },  // Image 4 : Droite
    { x: 4, y: 38, rot: -8, size: 85 },    // Image 5 : Gauche
    { x: 92, y: 44, rot: 22, size: 50 },   // Image 6 : Droite
    { x: 22, y: 52, rot: 16, size: 55 },   // Image 7 : Gauche
    { x: 78, y: 56, rot: -20, size: 60 },  // Image 8 : Droite
    { x: 8, y: 64, rot: -5, size: 70 },    // Image 9 : Gauche Bas
    { x: 89, y: 68, rot: 12, size: 80 }    // Image 10: Droite Bas
  ];

  imageNames.forEach((imgName, index) => {
    const pos = defaultPositions[index];
    const img = document.createElement('img');
    img.src = encodeURI(`asset/${imgName}`);
    img.className = 'floating-img';
    
    img.style.width = `${pos.size}px`;
    img.style.height = 'auto'; // Garde le ratio originel du PNG
    
    img.style.left = `${pos.x}%`;
    img.style.top = `${pos.y}%`;
    img.style.setProperty('--rot', `${pos.rot}deg`);
    
    // Apparition "pop" cascade pour l'explosion stylée
    img.style.animationDelay = `${0.1 + index * 0.05}s`;
    
    // Rendre l'image déplaçable (Drag & Drop)
    makeDraggable(img);
    
    floatContainer.appendChild(img);
  });
}

// Fonction utilitaire pour rendre un élément "Draggable"
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY;
  let initialLeft, initialTop;

  // Support Souris
  el.addEventListener('mousedown', dragStart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragEnd);

  // Support Tactile (Mobile)
  el.addEventListener('touchstart', dragStart, {passive: false});
  document.addEventListener('touchmove', drag, {passive: false});
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    if (e.type === 'mousedown' && e.button !== 0) return; // Uniquement le clic gauche
    
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    // Convertir les pourcentages en pixels pour un déplacement sans "saut"
    initialLeft = el.offsetLeft;
    initialTop = el.offsetTop;
    
    // Quand on la prend, elle passe devant tout et perd sa transition CSS temporairement
    el.style.transition = 'none';
    el.style.zIndex = 50;
    el.style.cursor = 'grabbing';
    el.style.transform = `scale(1.1) rotate(0deg)`; // Petit effet gonflé

    if(e.type === 'mousedown') e.preventDefault(); // Évite la sélection de l'image
  }

  function drag(e) {
    if (!isDragging) return;
    
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    el.style.left = `${initialLeft + dx}px`;
    el.style.top = `${initialTop + dy}px`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    
    el.style.cursor = 'grab';
    el.style.zIndex = 10; // Reste au-dessus des images non touchées
    
    // Transition fluide quand on la "lâche"
    el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Rotation aléatoire finale comme si elle retombait sur la table
    const rot = (Math.random() - 0.5) * 40;
    el.style.transform = `scale(1) rotate(${rot}deg)`;
  }
}



/* =============================================
   12. DA Navigation
   (Scrapbook retiré, navigation classique)
   ============================================= */
