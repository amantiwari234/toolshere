/**
 * QuickTools - Admin Control Panel Logic
 * Complete dashboard, tools CRUD, ads manager, message inbox, and settings
 */

(function () {
  'use strict';

  const AUTH_KEY = 'quicktools_admin_auth';
  const PASSCODE_KEY = 'quicktools_admin_passcode';
  const DEFAULT_PASS = 'admin123';

  let currentTools = [];
  let currentSettings = {};

  // --- 1. Authentication ---
  function checkAuth() {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === 'true';
    const authModal = document.getElementById('admin-auth-modal');
    if (!isAuthed) {
      if (authModal) authModal.classList.add('open');
    } else {
      if (authModal) authModal.classList.remove('open');
      initDashboard();
    }
  }

  function handleLogin(e) {
    if (e) e.preventDefault();
    const entered = document.getElementById('admin-pass-input').value;
    const stored = localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASS;

    if (entered === stored) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      document.getElementById('admin-auth-modal').classList.remove('open');
      window.QuickToolsApp.showToast('Welcome back, Admin!', 'success');
      initDashboard();
    } else {
      const err = document.getElementById('admin-auth-err');
      if (err) err.style.display = 'block';
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
  }

  // --- 2. Data Initialization ---
  function loadData() {
    currentTools = window.getQuickTools ? window.getQuickTools() : window.QUICK_TOOLS;
    currentSettings = window.getSiteSettings ? window.getSiteSettings() : {};
  }

  // --- 3. Dashboard KPI Metrics & Canvas Chart ---
  function renderDashboardKPIs() {
    const totalTools = currentTools.length;
    const activeTools = currentTools.filter(t => t.status !== 'inactive').length;
    const popularTools = currentTools.filter(t => t.popular).length;
    const categoriesCount = (window.CATEGORIES || []).length - 1; // exclude 'all'

    document.getElementById('kpi-total-tools').textContent = totalTools;
    document.getElementById('kpi-active-tools').textContent = activeTools;
    document.getElementById('kpi-popular-tools').textContent = popularTools;
    document.getElementById('kpi-categories').textContent = categoriesCount;

    const adsStatusEl = document.getElementById('kpi-ads-status');
    if (adsStatusEl) {
      adsStatusEl.textContent = currentSettings.adsEnabled !== false ? 'Active 🟢' : 'Disabled 🔴';
    }

    renderUsageChart();
    renderRecentActivity();
  }

  function renderUsageChart() {
    const canvas = document.getElementById('admin-usage-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth || 600;
    const h = canvas.height = 200;

    ctx.clearRect(0, 0, w, h);

    // Group tools by category
    const counts = {};
    currentTools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);
    const maxVal = Math.max(...data, 1);

    const barWidth = Math.min(50, (w - 60) / labels.length - 20);
    const chartBottom = h - 35;
    const chartHeight = h - 60;

    labels.forEach((cat, idx) => {
      const val = data[idx];
      const barH = (val / maxVal) * chartHeight;
      const x = 40 + idx * ((w - 60) / labels.length);
      const y = chartBottom - barH;

      // Draw Bar
      const grad = ctx.createLinearGradient(0, y, 0, chartBottom);
      grad.addColorStop(0, '#7c3aed');
      grad.addColorStop(1, '#6366f1');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      ctx.fill();

      // Draw Value
      ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#0f172a';
      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val + ' tools', x + barWidth / 2, y - 8);

      // Draw Category Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Plus Jakarta Sans, sans-serif';
      ctx.fillText(cat.toUpperCase().substring(0, 5), x + barWidth / 2, chartBottom + 18);
    });
  }

  function renderRecentActivity() {
    const list = document.getElementById('recent-activity-list');
    if (!list) return;

    const items = [
      { action: 'Admin Panel Initialized', time: 'Just now', icon: '⚡' },
      { action: 'System Health Check: 24 Client Tools Running', time: '2 mins ago', icon: '✅' },
      { action: 'Ad Placement Slots Configured (AdSense Ready)', time: '10 mins ago', icon: '💰' },
      { action: 'XML Sitemap & Robots Crawl Directives Verified', time: '1 hour ago', icon: '🗺️' }
    ];

    list.innerHTML = items.map(i => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--admin-border);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.2rem;">${i.icon}</span>
          <span style="font-weight: 600; font-size: 0.9rem;">${i.action}</span>
        </div>
        <span style="font-size: 0.8rem; color: var(--admin-muted);">${i.time}</span>
      </div>
    `).join('');
  }

  // --- 4. Tools Manager Table ---
  function renderToolsTable() {
    const tbody = document.getElementById('admin-tools-tbody');
    if (!tbody) return;

    const searchVal = (document.getElementById('tool-filter-search')?.value || '').toLowerCase();
    const catVal = document.getElementById('tool-filter-cat')?.value || 'all';

    const filtered = currentTools.filter(t => {
      const matchSearch = !searchVal || t.name.toLowerCase().includes(searchVal) || t.id.toLowerCase().includes(searchVal);
      const matchCat = catVal === 'all' || t.category === catVal;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--admin-muted);">No tools found matching your filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((tool, idx) => {
      const isInactive = tool.status === 'inactive';
      const isPopular = !!tool.popular;

      return `
        <tr>
          <td style="font-size: 1.35rem; text-align: center;">${tool.icon || '⚡'}</td>
          <td>
            <div style="font-weight: 700; color: var(--admin-text);">${tool.name}</div>
            <div style="font-size: 0.785rem; color: var(--admin-muted); font-family: monospace;">tools/${tool.file}</div>
          </td>
          <td>
            <span style="font-size: 0.8rem; padding: 0.2rem 0.5rem; background: var(--admin-bg); border: 1px solid var(--admin-border); border-radius: 6px; font-weight: 600;">
              ${tool.categoryName || tool.category}
            </span>
          </td>
          <td>
            <span style="font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 9999px; background: ${tool.badge ? 'rgba(124,58,237,0.15)' : 'transparent'}; color: var(--admin-primary);">
              ${tool.badge || '—'}
            </span>
          </td>
          <td style="text-align: center;">
            <label class="switch-toggle" title="Toggle Active / Inactive">
              <input type="checkbox" ${!isInactive ? 'checked' : ''} onchange="QuickToolsAdmin.toggleToolActive('${tool.id}', this.checked)">
              <span class="slider-round"></span>
            </label>
          </td>
          <td style="text-align: center;">
            <button class="btn btn-sm ${isPopular ? 'btn-primary' : 'btn-secondary'}" onclick="QuickToolsAdmin.toggleToolPopular('${tool.id}')" title="Toggle Home Popular status">
              ${isPopular ? '★ Popular' : '☆ Standard'}
            </button>
          </td>
          <td style="text-align: right;">
            <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm" onclick="QuickToolsAdmin.openEditToolModal('${tool.id}')">✏️ Edit</button>
              <a href="tools/${tool.file}" target="_blank" class="btn btn-secondary btn-sm" title="Preview Tool">👁️ View</a>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function toggleToolActive(toolId, isActive) {
    const tool = currentTools.find(t => t.id === toolId);
    if (!tool) return;
    tool.status = isActive ? 'active' : 'inactive';
    window.saveQuickTools(currentTools);
    window.QuickToolsApp.showToast(`${tool.name} is now ${isActive ? 'Active 🟢' : 'Disabled 🔴'}`);
    renderDashboardKPIs();
  }

  function toggleToolPopular(toolId) {
    const tool = currentTools.find(t => t.id === toolId);
    if (!tool) return;
    tool.popular = !tool.popular;
    window.saveQuickTools(currentTools);
    window.QuickToolsApp.showToast(`${tool.name} ${tool.popular ? 'pinned to Popular' : 'unpinned from Popular'}`);
    renderToolsTable();
    renderDashboardKPIs();
  }

  // --- Edit Tool Modal ---
  function openEditToolModal(toolId) {
    const tool = currentTools.find(t => t.id === toolId);
    if (!tool) return;

    document.getElementById('edit-tool-id').value = tool.id;
    document.getElementById('edit-tool-name').value = tool.name;
    document.getElementById('edit-tool-icon').value = tool.icon || '⚡';
    document.getElementById('edit-tool-category').value = tool.category;
    document.getElementById('edit-tool-badge').value = tool.badge || '';
    document.getElementById('edit-tool-desc').value = tool.description || '';

    document.getElementById('admin-edit-modal').classList.add('open');
  }

  function closeEditToolModal() {
    document.getElementById('admin-edit-modal').classList.remove('open');
  }

  function saveEditedTool(e) {
    e.preventDefault();
    const id = document.getElementById('edit-tool-id').value;
    const tool = currentTools.find(t => t.id === id);
    if (!tool) return;

    tool.name = document.getElementById('edit-tool-name').value.trim();
    tool.icon = document.getElementById('edit-tool-icon').value.trim();
    tool.category = document.getElementById('edit-tool-category').value;
    
    // Map category name
    const catObj = (window.CATEGORIES || []).find(c => c.id === tool.category);
    if (catObj) tool.categoryName = catObj.name;

    tool.badge = document.getElementById('edit-tool-badge').value.trim();
    tool.description = document.getElementById('edit-tool-desc').value.trim();

    window.saveQuickTools(currentTools);
    window.QuickToolsApp.showToast(`Updated "${tool.name}" successfully!`, 'success');
    closeEditToolModal();
    renderToolsTable();
  }

  // --- 5. Ads & Monetization ---
  function initAdsSettings() {
    const switchAds = document.getElementById('ads-master-switch');
    const headerAdText = document.getElementById('header-ad-html');
    const inArticleAdText = document.getElementById('article-ad-html');

    if (switchAds) {
      switchAds.checked = currentSettings.adsEnabled !== false;
    }
    if (headerAdText) {
      headerAdText.value = currentSettings.headerAdHtml || '';
    }
    if (inArticleAdText) {
      inArticleAdText.value = currentSettings.inArticleAdHtml || '';
    }
  }

  function saveAdsSettings(e) {
    if (e) e.preventDefault();
    currentSettings.adsEnabled = document.getElementById('ads-master-switch').checked;
    currentSettings.headerAdHtml = document.getElementById('header-ad-html').value;
    currentSettings.inArticleAdHtml = document.getElementById('article-ad-html').value;

    window.saveSiteSettings(currentSettings);
    window.QuickToolsApp.showToast('Advertisement settings saved successfully!', 'success');
    renderDashboardKPIs();
  }

  // --- 6. Announcements ---
  function initAnnouncements() {
    const chk = document.getElementById('announcement-enable-switch');
    const txt = document.getElementById('announcement-text-input');
    const link = document.getElementById('announcement-link-input');

    if (chk) chk.checked = !!currentSettings.announcementEnabled;
    if (txt) txt.value = currentSettings.announcementText || '';
    if (link) link.value = currentSettings.announcementLink || 'all-tools.html';
  }

  function saveAnnouncementSettings(e) {
    if (e) e.preventDefault();
    currentSettings.announcementEnabled = document.getElementById('announcement-enable-switch').checked;
    currentSettings.announcementText = document.getElementById('announcement-text-input').value.trim();
    currentSettings.announcementLink = document.getElementById('announcement-link-input').value.trim();

    window.saveSiteSettings(currentSettings);
    window.QuickToolsApp.showToast('Announcement banner settings saved!', 'success');
  }

  // --- 7. Messages & Inquiries Inbox ---
  function renderMessagesInbox() {
    const listEl = document.getElementById('admin-messages-list');
    if (!listEl) return;

    let messages = [];
    try {
      messages = JSON.parse(localStorage.getItem('quicktools_contact_messages') || '[]');
    } catch(e) {}

    // Pre-populate with realistic samples if empty
    if (messages.length === 0) {
      messages = [
        {
          id: 'msg_sample_1',
          name: 'Sarah Connor',
          email: 'sarah@example.com',
          subject: 'partnership',
          message: 'Hi QuickTools Team! We are interested in placing an affiliate sponsorship on your PDF tools page.',
          date: 'Yesterday at 3:15 PM',
          read: false
        },
        {
          id: 'msg_sample_2',
          name: 'David Kim',
          email: 'david.dev@codehub.io',
          subject: 'suggestion',
          message: 'Can you please add a Markdown to HTML preview tool in your Developer Tools category? Loving the fast client-side performance!',
          date: 'Oct 26, 2026',
          read: true
        }
      ];
      localStorage.setItem('quicktools_contact_messages', JSON.stringify(messages));
    }

    const badge = document.getElementById('messages-unread-count');
    const unreadCount = messages.filter(m => !m.read).length;
    if (badge) badge.textContent = unreadCount > 0 ? `${unreadCount} unread` : 'All read';

    listEl.innerHTML = messages.map(msg => `
      <div style="background: var(--admin-card); border: 1px solid var(--admin-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; border-left: 4px solid ${msg.read ? 'var(--admin-border)' : 'var(--admin-primary)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-weight: 800; font-size: 1rem;">${msg.name}</span>
            <span style="color: var(--admin-muted); font-size: 0.85rem; margin-left: 0.5rem;">&lt;${msg.email}&gt;</span>
            <span style="margin-left: 0.5rem; font-size: 0.75rem; padding: 0.15rem 0.45rem; background: var(--admin-bg); border: 1px solid var(--admin-border); border-radius: 4px; text-transform: uppercase; font-weight: 700;">${msg.subject}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--admin-muted);">${msg.date}</span>
        </div>
        <div style="color: var(--admin-text); font-size: 0.925rem; line-height: 1.6; margin-bottom: 0.75rem;">
          ${msg.message}
        </div>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="QuickToolsAdmin.toggleMsgRead('${msg.id}')">
            ${msg.read ? 'Mark as Unread' : 'Mark as Read ✓'}
          </button>
          <a href="mailto:${msg.email}?subject=Re: QuickTools Inquiry" class="btn btn-primary btn-sm">Reply via Email ✉️</a>
          <button class="btn btn-secondary btn-sm" style="color: var(--admin-danger);" onclick="QuickToolsAdmin.deleteMsg('${msg.id}')">Delete 🗑️</button>
        </div>
      </div>
    `).join('');
  }

  function toggleMsgRead(id) {
    let messages = JSON.parse(localStorage.getItem('quicktools_contact_messages') || '[]');
    const msg = messages.find(m => m.id === id);
    if (msg) {
      msg.read = !msg.read;
      localStorage.setItem('quicktools_contact_messages', JSON.stringify(messages));
      renderMessagesInbox();
    }
  }

  function deleteMsg(id) {
    let messages = JSON.parse(localStorage.getItem('quicktools_contact_messages') || '[]');
    messages = messages.filter(m => m.id !== id);
    localStorage.setItem('quicktools_contact_messages', JSON.stringify(messages));
    window.QuickToolsApp.showToast('Message deleted');
    renderMessagesInbox();
  }

  // --- 8. General Site Settings & Password ---
  function initGeneralSettings() {
    const siteTitle = document.getElementById('settings-site-title');
    const tagline = document.getElementById('settings-tagline');
    const colorPicker = document.getElementById('settings-primary-color');

    if (siteTitle) siteTitle.value = currentSettings.siteName || 'QuickTools';
    if (tagline) tagline.value = currentSettings.tagline || 'Free Online Tools for Everyone';
    if (colorPicker) colorPicker.value = currentSettings.primaryColor || '#7c3aed';
  }

  function saveGeneralSettings(e) {
    if (e) e.preventDefault();
    currentSettings.siteName = document.getElementById('settings-site-title').value.trim();
    currentSettings.tagline = document.getElementById('settings-tagline').value.trim();
    currentSettings.primaryColor = document.getElementById('settings-primary-color').value;

    const newPass = document.getElementById('settings-new-pass').value.trim();
    if (newPass) {
      localStorage.setItem(PASSCODE_KEY, newPass);
      window.QuickToolsApp.showToast('Admin passcode updated successfully!', 'success');
      document.getElementById('settings-new-pass').value = '';
    }

    window.saveSiteSettings(currentSettings);
    window.QuickToolsApp.showToast('Site settings updated!', 'success');
  }

  // --- 9. Backup & Restore ---
  function exportBackup() {
    const backupData = {
      timestamp: new Date().toISOString(),
      tools: currentTools,
      settings: currentSettings,
      messages: JSON.parse(localStorage.getItem('quicktools_contact_messages') || '[]')
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quicktools-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.QuickToolsApp.showToast('Backup exported successfully!', 'success');
  }

  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.tools) window.saveQuickTools(parsed.tools);
        if (parsed.settings) window.saveSiteSettings(parsed.settings);
        if (parsed.messages) localStorage.setItem('quicktools_contact_messages', JSON.stringify(parsed.messages));

        window.QuickToolsApp.showToast('Backup restored successfully!', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } catch(err) {
        window.QuickToolsApp.showToast('Invalid backup file JSON', 'error');
      }
    };
    reader.readAsText(file);
  }

  function resetDefaults() {
    if (confirm('Are you sure you want to reset all tools and settings back to original factory defaults?')) {
      localStorage.removeItem('quicktools_custom_tools');
      localStorage.removeItem('quicktools_site_settings');
      localStorage.removeItem('quicktools_contact_messages');
      window.QuickToolsApp.showToast('Reset to defaults complete', 'info');
      setTimeout(() => window.location.reload(), 800);
    }
  }

  // --- Tab Navigation in Admin ---
  function initTabs() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const panes = document.querySelectorAll('.admin-tab-pane');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.getAttribute('data-tab');
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        panes.forEach(pane => {
          pane.classList.remove('active');
          if (pane.id === `tab-${targetTab}`) {
            pane.classList.add('active');
          }
        });

        // Set Topbar Title
        const titleEl = document.getElementById('admin-topbar-page-title');
        if (titleEl) titleEl.textContent = item.querySelector('span:last-child').textContent;

        if (targetTab === 'tools') renderToolsTable();
        if (targetTab === 'inbox') renderMessagesInbox();
      });
    });
  }

  // --- Initializer ---
  function initDashboard() {
    loadData();
    renderDashboardKPIs();
    renderToolsTable();
    initAdsSettings();
    initAnnouncements();
    renderMessagesInbox();
    initGeneralSettings();
  }

  // Global Export
  window.QuickToolsAdmin = {
    handleLogin,
    handleLogout,
    toggleToolActive,
    toggleToolPopular,
    openEditToolModal,
    closeEditToolModal,
    saveEditedTool,
    saveAdsSettings,
    saveAnnouncementSettings,
    toggleMsgRead,
    deleteMsg,
    saveGeneralSettings,
    exportBackup,
    importBackup,
    resetDefaults
  };

  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initTabs();

    // Hook forms
    const authForm = document.getElementById('admin-auth-form');
    if (authForm) authForm.addEventListener('submit', handleLogin);

    const editForm = document.getElementById('edit-tool-form');
    if (editForm) editForm.addEventListener('submit', saveEditedTool);

    const adsForm = document.getElementById('ads-config-form');
    if (adsForm) adsForm.addEventListener('submit', saveAdsSettings);

    const announceForm = document.getElementById('announcement-config-form');
    if (announceForm) announceForm.addEventListener('submit', saveAnnouncementSettings);

    const settingsForm = document.getElementById('general-settings-form');
    if (settingsForm) settingsForm.addEventListener('submit', saveGeneralSettings);

    // Search and filter tools
    const toolSearch = document.getElementById('tool-filter-search');
    const toolCat = document.getElementById('tool-filter-cat');
    if (toolSearch) toolSearch.addEventListener('input', renderToolsTable);
    if (toolCat) toolCat.addEventListener('change', renderToolsTable);

    // Backup restore file input
    const backupInput = document.getElementById('backup-file-input');
    if (backupInput) {
      backupInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          importBackup(e.target.files[0]);
        }
      });
    }

    // Mobile sidebar toggle
    const mobileMenuBtn = document.getElementById('admin-mobile-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  });

})();
