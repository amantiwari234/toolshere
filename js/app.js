/**
 * QuickTools - Main Application Script
 * Theme toggle, navigation, search, toasts, and shared UI handlers
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const THEME_KEY = 'quicktools_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
  }

  // --- Mobile Menu ---
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav-drawer');
    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const isOpen = mobileNav.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- FAQ Accordions ---
  function initFaqAccordions() {
    document.querySelectorAll('.faq-question').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        if (!item) return;
        const wasOpen = item.classList.contains('open');
        // Close others in same grid
        const parentGrid = item.closest('.faq-grid');
        if (parentGrid) {
          parentGrid.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        }
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // --- Toast Notifications ---
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- Global Copy Helper ---
  function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (!text) {
      showToast('Nothing to copy', 'error');
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg, 'success');
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  }

  function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg, 'success');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
    document.body.removeChild(textArea);
  }

  // --- Render Related Tools ---
  function renderRelatedTools(currentToolId, targetContainerId, limit = 3) {
    const container = document.getElementById(targetContainerId);
    if (!container || !window.QUICK_TOOLS) return;

    const currentTool = window.QUICK_TOOLS.find(t => t.id === currentToolId);
    let candidates = [];

    if (currentTool) {
      // Prioritize same category, then others
      const sameCat = window.QUICK_TOOLS.filter(t => t.category === currentTool.category && t.id !== currentToolId);
      const otherCat = window.QUICK_TOOLS.filter(t => t.category !== currentTool.category && t.id !== currentToolId);
      candidates = [...sameCat, ...otherCat];
    } else {
      candidates = window.QUICK_TOOLS;
    }

    const isInsideTools = window.location.pathname.includes('/tools/');
    const selected = candidates.slice(0, limit);

    container.innerHTML = selected.map(tool => {
      const href = isInsideTools ? tool.file : `tools/${tool.file}`;
      return `
        <a href="${href}" class="tool-card">
          <div class="tool-card-header">
            <div class="tool-icon-box">${tool.icon}</div>
            <span class="tool-badge ${tool.popular ? 'popular' : ''}">${tool.badge || tool.categoryName}</span>
          </div>
          <h3 class="tool-card-title">${tool.name}</h3>
          <p class="tool-card-desc">${tool.description}</p>
          <div class="tool-card-footer">
            <span>Use Free Tool</span>
            <span class="arrow-icon">→</span>
          </div>
        </a>
      `;
    }).join('');
  }

  // --- Keyboard Shortcuts ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          e.preventDefault();
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Export functions globally
  const appExports = {
    toggleTheme,
    showToast,
    copyToClipboard,
    renderRelatedTools
  };

  window.QuickToolsApp = appExports;
  window.ToolshereApp = appExports;
  window.Toolshere = window.Toolshere || {};
  window.ToolshereApp = appExports;
  window.Toolshere.App = appExports;

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initFaqAccordions();
    initKeyboardShortcuts();

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  });

})();
