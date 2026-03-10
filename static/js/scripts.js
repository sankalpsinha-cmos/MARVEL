
// ======================== THEME ========================
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
let isDark = true;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '🌙' : '☀️';
});

// ======================== HAMBURGER ========================
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.getElementById('moreDropdown').addEventListener('click', function(e) {
  this.classList.toggle('open');
  e.stopPropagation();
});

// ======================== READING PROGRESS ========================
window.addEventListener('scroll', () => {
  const el = document.getElementById('readingProgress');
  const total = document.documentElement.scrollHeight - window.innerHeight;
  el.style.width = (window.scrollY / total * 100) + '%';
});

// ======================== SCROLL ANIMATION ========================
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ======================== 3D MESH ANIMATION ========================
(function() {
  const canvas = document.getElementById('mesh-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 4;

  // Create multiple rotating mesh objects
  const meshObjects = [];

  function createWireframeSphere(radius, detail, colorHex, x, y, z, speed) {
    const geo = new THREE.IcosahedronGeometry(radius, detail);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.35 });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { speed, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() };
    scene.add(mesh);
    meshObjects.push(mesh);
    return mesh;
  }

  function createWireframeBox(size, colorHex, x, y, z, speed) {
    const geo = new THREE.BoxGeometry(size, size, size);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.25 });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { speed, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() };
    scene.add(mesh);
    meshObjects.push(mesh);
  }

  function createWireframeOctahedron(r, colorHex, x, y, z, speed) {
    const geo = new THREE.OctahedronGeometry(r);
    const edges = new THREE.EdgesGeometry(geo);
    const mat = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.3 });
    const mesh = new THREE.LineSegments(edges, mat);
    mesh.position.set(x, y, z);
    mesh.userData = { speed, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() };
    scene.add(mesh);
    meshObjects.push(mesh);
  }

  // Large central sphere
  createWireframeSphere(1.4, 3, 0x8B5CF6, 0, 0, 0, 0.003);
  // Secondary shapes
  createWireframeSphere(0.6, 2, 0xEF4444, -2.5, 1, -1, 0.005);
  createWireframeSphere(0.5, 2, 0x06B6D4, 2.8, -0.8, -1, 0.004);
  createWireframeBox(0.8, 0xF59E0B, 2, 1.5, -0.5, 0.006);
  createWireframeBox(0.5, 0x8B5CF6, -2, -1.5, -0.8, 0.007);
  createWireframeOctahedron(0.6, 0x06B6D4, -1.5, -1.8, -0.3, 0.008);
  createWireframeOctahedron(0.45, 0xEF4444, 1.8, -1.8, -0.5, 0.006);
  createWireframeSphere(0.3, 1, 0xF59E0B, 0.8, 2.2, -0.5, 0.009);
  createWireframeSphere(0.35, 1, 0xA78BFA, -0.5, 2, -0.3, 0.007);

  // Floating point cloud
  const pointsGeo = new THREE.BufferGeometry();
  const pointCount = 200;
  const positions = new Float32Array(pointCount * 3);
  for (let i = 0; i < pointCount; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 12;
    positions[i*3+1] = (Math.random() - 0.5) * 10;
    positions[i*3+2] = (Math.random() - 0.5) * 6 - 2;
  }
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({ color: 0x8B5CF6, size: 0.025, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(pointsGeo, pointsMat));

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    meshObjects.forEach((m, i) => {
      m.rotateOnAxis(m.userData.axis, m.userData.speed);
      // Gentle float
      m.position.y += Math.sin(t + i * 0.7) * 0.001;
    });

    // Camera parallax
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();

// ======================== AUTHOR TOOLTIPS ========================
const authorData = [
  { id:'a0', name:'Sankalp Sinha', note:'* Equal Contribution', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=QYcfOjEAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:sankalp.sinha@dfki.de' },
    { icon:'fas fa-globe', label:'Website', url:'https://av.dfki.de/members/sinha/' },
  ]},
  { id:'a1', name:'Mohammad Sadil Khan', note:'* Equal Contribution · Corresponding Author', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=XIDQo_IAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:mohammad.khan@dfki.de' },
    { icon:'fas fa-globe', label:'Website', url:'https://mdsadilkhan.onrender.com/' },
  ]},
  { id:'a2', name:'Muhammad Usama', note:'', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=zcRPmUoAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:Muhammad.Usama@dfki.de' },
    { icon:'fas fa-globe', label:'Website', url:'https://www.dfki.de/web/ueber-uns/mitarbeiter/person/muus02' },
  ]},
  { id:'a3', name:'Shino Sam', note:'', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=U3wWLBcAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:shino.sam@dfki.de' },
  ]},
  { id:'a4', name:'Didier Stricker', note:'', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=ImhXfxgAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:didier.stricker@dfki.de' },
    { icon:'fas fa-globe', label:'Website', url:'https://av.dfki.de/members/stricker/' },
  ]},
  { id:'a5', name:'Sk Aziz Ali', note:'', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=zywjMeMAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:skaziz.ali@hyderabad.bits-pilani.ac.in' },
    { icon:'fas fa-globe', label:'Website', url:'https://skazizali.com/' },
  ]},
  { id:'a6', name:'Muhammad Zeshan Afzal', note:'', links:[
    { icon:'fas fa-graduation-cap', label:'Scholar', url:'https://scholar.google.com/citations?user=kHMVj6oAAAAJ' },
    { icon:'fas fa-envelope', label:'Email', url:'mailto:muhammad_zeshan.afzal@dfki.uni-kl.de' },
    { icon:'fas fa-globe', label:'Website', url:'https://av.dfki.de/members/afzal/' },
  ]},
];

const tooltip = document.getElementById('authorTooltip');
let activeAuthor = null;

document.querySelectorAll('.author-item').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = el.dataset.id;

    if (activeAuthor === el) {
      tooltip.classList.remove('visible');
      el.classList.remove('active');
      activeAuthor = null;
      return;
    }

    document.querySelectorAll('.author-item').forEach(a => a.classList.remove('active'));
    el.classList.add('active');
    activeAuthor = el;

    const data = authorData.find(a => a.id === id);
    document.getElementById('tooltipName').textContent = data.name;
    const noteEl = document.getElementById('tooltipNote');
    noteEl.textContent = data.note;
    noteEl.style.display = data.note ? 'block' : 'none';
    document.getElementById('tooltipLinks').innerHTML = data.links.map(l =>
      `<a href="${l.url}" target="_blank"><i class="${l.icon}"></i> ${l.label}</a>`
    ).join('');

    // Position below the clicked name
    const rect = el.getBoundingClientRect();
    const tw = 240;
    let left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    tooltip.style.width = tw + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.top = (rect.bottom + 10) + 'px';

    tooltip.classList.add('visible');
  });
});

document.addEventListener('click', () => {
  tooltip.classList.remove('visible');
  document.querySelectorAll('.author-item').forEach(a => a.classList.remove('active'));
  activeAuthor = null;
});
tooltip.addEventListener('click', e => e.stopPropagation());

// ======================== SKETCHFAB SLIDER ========================
(function() {
  const track = document.getElementById('sketchTrack');
  const items = track.querySelectorAll('.slide-item');
  const dotsContainer = document.getElementById('sketchDots');
  let current = 0;
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i===0?' active':'');
    d.addEventListener('click', () => go(i));
    dotsContainer.appendChild(d);
  }

  function go(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===current));
  }

  document.getElementById('sketchPrev').addEventListener('click', () => go(current - 1));
  document.getElementById('sketchNext').addEventListener('click', () => go(current + 1));
})();

// ======================== FX3D SLIDER ========================
(function() {
  const track = document.getElementById('fx3dTrack');
  const slides = track.querySelectorAll('.fx3d-slide');
  const dotsContainer = document.getElementById('fx3dDots');
  let current = 0;
  const total = slides.length;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i===0?' active':'');
    d.addEventListener('click', () => go(i));
    dotsContainer.appendChild(d);
  }

  function go(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===current));
  }

  document.getElementById('fx3dPrev').addEventListener('click', () => go(current - 1));
  document.getElementById('fx3dNext').addEventListener('click', () => go(current + 1));
})();

// ======================== TABS ========================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tabId = this.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');

    // Lazy-render charts
    if (tabId === 'linguistic' && !window.linguisticRendered) { renderLinguisticCharts(); window.linguisticRendered = true; }
    if (tabId === 'alignment' && !window.alignmentRendered) { renderAlignmentCharts(); window.alignmentRendered = true; }
    if (tabId === 'accuracy' && !window.accuracyRendered) { renderAccuracyCharts(); window.accuracyRendered = true; }
    if (tabId === 'generation' && !window.generationRendered) { renderRadarChart(); window.generationRendered = true; }
  });
});

document.querySelectorAll('.subtab-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const panel = this.closest('.tab-panel');
    const subtabId = this.dataset.subtab;
    panel.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
    panel.querySelectorAll('.subtab-panel').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
    panel.querySelector('#sub-' + subtabId).classList.add('active');
  });
});

// ======================== CHART HELPERS ========================
const isDarkMode = () => document.documentElement.getAttribute('data-theme') === 'dark';
const chartColors = ['#8B5CF6','#EF4444','#F59E0B','#06B6D4'];
const chartColorsAlpha = ['rgba(139,92,246,0.8)','rgba(239,68,68,0.8)','rgba(245,158,11,0.8)','rgba(6,182,212,0.8)'];

function getChartDefaults() {
  const dark = isDarkMode();
  return {
    color: dark ? '#A8A8C0' : '#3D3B55',
    gridColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    bgPlugin: dark ? '#0C0C1A' : '#FAFAFA',
    titleColor: dark ? '#F0EFFF' : '#12101E',
  };
}

function makeBarChart(id, label, labels, data) {
  const d = getChartDefaults();
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: chartColorsAlpha,
        borderColor: chartColors,
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
        barThickness: window.innerWidth < 600 ? 30 : 55,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: label, color: d.titleColor, font: { size: 15, weight: '600', family: "'Plus Jakarta Sans'" } },
        tooltip: {
          backgroundColor: d.bgPlugin === '#0C0C1A' ? '#1a1a2e' : '#fff',
          titleColor: d.titleColor,
          bodyColor: d.color,
          borderColor: 'rgba(139,92,246,0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 10,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: d.gridColor },
          ticks: { color: d.color, font: { size: 13 } },
          border: { color: 'transparent' },
        },
        x: {
          grid: { display: false },
          ticks: { color: d.color, font: { size: 13, weight: '500' } },
          border: { color: 'transparent' },
        }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });
}

function renderLinguisticCharts() {
  const labels = ['Cap3D', '3D-Topia', 'Kabra', 'MARVEL (L4)'];
  makeBarChart('avgLengthChart', 'Average Caption Length', labels, [16, 29, 5, 44]);
  makeBarChart('mtldChart', 'Measure of Lexical Diversity (MTLD)', labels, [39.71, 41.43, 25.85, 47.43]);
  makeBarChart('unigramChart', 'Unigram Count', labels, [15189, 10329, 3862, 27659]);
  makeBarChart('bigramChart', 'Bi-Gram Count', labels, [123071, 95856, 19753, 239052]);
}
// Auto-render linguistic since it's the default tab
window.addEventListener('DOMContentLoaded', () => { renderLinguisticCharts(); window.linguisticRendered = true; });

function makePieChart(id, title, labels, data) {
  const d = getChartDefaults();
  const ctx = document.getElementById(id);
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: chartColorsAlpha,
        borderColor: chartColors,
        borderWidth: 2,
        hoverOffset: 12,
      }]
    },
    options: {
      responsive: true,
      cutout: '55%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: d.color, font: { size: 13, family: "'Plus Jakarta Sans'" }, padding: 16, usePointStyle: true, pointStyleWidth: 10 }
        },
        title: { display: true, text: title, color: d.titleColor, font: { size: 15, weight: '600', family: "'Plus Jakarta Sans'" }, padding: { bottom: 16 } },
        tooltip: {
          backgroundColor: '#1a1a2e',
          titleColor: '#F0EFFF',
          bodyColor: '#A8A8C0',
          borderColor: 'rgba(139,92,246,0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
        }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });
}

function renderAlignmentCharts() {
  const labels = ['Cap3D', '3D-Topia', 'Kabra', 'MARVEL (L4)'];
  makePieChart('gpt4PieChart', 'GPT-4 Image-Text Alignment Preference (%)', labels, [14.55, 10.8, 2.24, 72.41]);
  makePieChart('humanPieChart', 'Human Image-Text Alignment Preference (%)', labels, [9.5, 14.0, 3.1, 73.4]);
}

function renderAccuracyCharts() {
  const labels = ['Cap3D', '3D-Topia', 'Kabra', 'MARVEL (L1)'];
  makeBarChart('gpt4CaptionBar', 'Caption Accuracy — GPT-4 Evaluation (%)', labels, [76.0, 54.6, 83.4, 84.7]);
  makeBarChart('humanCaptionBar', 'Caption Accuracy — Human Evaluation (%)', labels, [72.8, 44.8, 78.2, 82.8]);
}

function renderRadarChart() {
  const d = getChartDefaults();
  const ctx = document.getElementById('textTo3DRadar');
  if (!ctx) return;
  const ds = [
    { label: 'Shap-E',        data: [3.31,2.25,2.65,2.41], bg: 'rgba(239,68,68,0.15)', border: '#EF4444', point: '#EF4444' },
    { label: 'DreamFusion',   data: [4.88,3.74,4.22,4.09], bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', point: '#F59E0B' },
    { label: 'HiFA',          data: [6.59,6.42,6.88,6.44], bg: 'rgba(6,182,212,0.15)',  border: '#06B6D4', point: '#06B6D4' },
    { label: 'Lucid-Dreamer', data: [7.25,6.47,6.62,6.59], bg: 'rgba(167,139,250,0.15)', border: '#A78BFA', point: '#A78BFA' },
    { label: 'MARVEL-FX3D',   data: [7.2,6.58,7.71,6.94],  bg: 'rgba(139,92,246,0.2)',  border: '#8B5CF6', point: '#8B5CF6' },
  ];
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Geometric Consistency','Visual Quality','Prompt Fidelity','Overall Preference'],
      datasets: ds.map(d => ({
        label: d.label, data: d.data,
        backgroundColor: d.bg, borderColor: d.border,
        pointBackgroundColor: d.point, pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff', pointHoverBorderColor: d.border,
        borderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { color: d.color, font: { size: 13, family: "'Plus Jakarta Sans'" }, padding: 14, usePointStyle: true } },
        title: { display: true, text: 'Text-to-3D Generation Evaluation (Human Study, 1–8 scale)', color: d.titleColor, font: { size: 14, weight: '600', family: "'Plus Jakarta Sans'" } },
        tooltip: {
          backgroundColor: '#1a1a2e', titleColor: '#F0EFFF', bodyColor: '#A8A8C0',
          borderColor: 'rgba(139,92,246,0.3)', borderWidth: 1, cornerRadius: 8,
        }
      },
      scales: {
        r: {
          beginAtZero: true, max: 8,
          ticks: { stepSize: 2, color: d.color, backdropColor: 'transparent', font: { size: 11 } },
          grid: { color: d.gridColor },
          angleLines: { color: d.gridColor },
          pointLabels: { color: d.color, font: { size: 13, weight: '600', family: "'Plus Jakarta Sans'" } }
        }
      },
      animation: { duration: 900, easing: 'easeOutQuart' }
    }
  });
}

// ======================== BIBTEX COPY ========================
document.getElementById('copyBibtex').addEventListener('click', function() {
  const text = document.getElementById('bibtexContent').innerText;
  navigator.clipboard.writeText(text).then(() => {
    this.textContent = '✅ Copied!';
    this.classList.add('success');
    setTimeout(() => { this.textContent = '📋 Copy'; this.classList.remove('success'); }, 2000);
  });
});