/**
 * ==========================================
 * Content Data - Programs, Questions, Ticker
 * ==========================================
 * Contains all dynamic content for the application
 */

/**
 * Helper Functions to Load Content from i18n
 */

// Get ticker content from current language
function getTickerContent() {
  if (window.i18n && window.i18n.translations) {
    const items = window.i18n.get('ticker.items');
    return Array.isArray(items) ? items : [];
  }
  return [];
}

// Get program data from current language
function getProgramData(programKey) {
  if (window.i18n && window.i18n.translations) {
    return window.i18n.get(`programs.data.${programKey}`);
  }
  return null;
}

// Initialize ticker
function updateTicker() {
  const tickerTrack = document.getElementById('tickerTrack');
  if (!tickerTrack) return;

  // Get ticker items from i18n
  const tickerItems = getTickerContent();

  // Create ticker content (duplicate for seamless loop)
  const content = [...tickerItems, ...tickerItems];
  tickerTrack.innerHTML = content.map(text => `<span>${text}</span>`).join('');
}

// Open program modal with questions
function openProgram(programKey) {
  const program = getProgramData(programKey);
  if (!program) return;

  const modal = document.getElementById('qModal');
  const modalTitle = document.getElementById('modalTitle');
  const questionsContainer = document.getElementById('questionsContainer');

  modalTitle.textContent = program.title;
  questionsContainer.innerHTML = program.questions.map((q, index) =>
    `<div class="q-item" onclick="showAnswer('${programKey}', ${index})">${q}</div>`
  ).join('');

  modal.classList.add('show');
}

// Show answer modal
function showAnswer(programKey, questionIndex) {
  const program = getProgramData(programKey);
  if (!program) return;

  const aModal = document.getElementById('aModal');
  const answerTitle = document.getElementById('answerTitle');
  const answerContent = document.getElementById('answerContent');

  answerTitle.textContent = program.questions[questionIndex];
  answerContent.innerHTML = `<p class="ans-text">${program.answers[questionIndex]}</p>`;

  // Close questions modal
  document.getElementById('qModal').classList.remove('show');

  // Open answer modal
  aModal.classList.add('show');
}

// Open messages modal
function openMessagesModal() {
  const modal = document.getElementById('messages-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

// Open reference modal
function openReferenceModal(refId) {
  // Extract the reference name from refId (e.g., 'reference-islam' => 'islam')
  const refName = refId.replace('reference-', '');

  console.log('Opening reference modal for:', refName);

  // Get the modal element
  const modal = document.getElementById('referenceModal');
  const modalTitle = document.getElementById('referenceModalTitle');
  const modalContent = document.getElementById('referenceModalContent');

  if (!modal || !modalTitle || !modalContent) {
    console.error('Modal elements not found');
    return;
  }

  if (!window.i18n) {
    console.error('i18n not initialized');
    return;
  }

  // Get content from i18n
  const title = window.i18n.get(`references.modals.${refName}.title`);
  const content = window.i18n.get(`references.modals.${refName}.content`);

  console.log('Title:', title);
  console.log('Content:', content);

  modalTitle.textContent = title || refName;
  modalContent.innerHTML = `<p style="margin: 0; padding: 15px 0;">${content || 'Content not available'}</p>`;

  modal.classList.add('show');
  console.log('Modal shown');
}

// Close reference modal
function closeReferenceModal() {
  const modal = document.getElementById('referenceModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Scroll to section
function scrollToSec(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 100;
    const targetPosition = section.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize counters with Intersection Observer
function initCountersObserver() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(c => c.innerText = '0');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        let start = 0;
        const duration = 2000;
        const step = target / (duration / 30);

        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            el.innerText = target;
            clearInterval(timer);
          } else {
            el.innerText = start.toFixed(1).replace('.0', '');
          }
        }, 30);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('#stats .counter, #losses .counter').forEach(c => {
    observer.observe(c);
  });
}

// Scroll to top button visibility
window.addEventListener('scroll', () => {
  const btnUp = document.getElementById('btnUp');
  if (btnUp) {
    if (window.pageYOffset > 300) {
      btnUp.style.display = 'flex';
    } else {
      btnUp.style.display = 'none';
    }
  }
});

// Initialize page
function initPage() {
  updateTicker();
  initCountersObserver();
  scrollToSec('home');
}

// Listen for language change events to update ticker
window.addEventListener('languageChanged', () => {
  if (typeof updateTicker === 'function') {
    updateTicker();
  }
});

// Make functions globally available
window.openProgram = openProgram;
window.showAnswer = showAnswer;
window.openMessagesModal = openMessagesModal;
window.openReferenceModal = openReferenceModal;
window.closeReferenceModal = closeReferenceModal;
window.scrollToSec = scrollToSec;
window.scrollToTop = scrollToTop;
window.initPage = initPage;
window.updateTicker = updateTicker;
window.initCountersObserver = initCountersObserver;
