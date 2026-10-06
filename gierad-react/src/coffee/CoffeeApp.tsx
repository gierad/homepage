import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Clock, Plus, Save, FolderOpen, Snowflake,
  Trash2, Eye, EyeOff, Activity, ArrowLeft
} from 'lucide-react';
import type { BeanData } from './data/initialBeans';
import { INITIAL_BEANS } from './data/initialBeans';
import { fetchBeans, saveAllBeansApi, upsertBeanApi, deleteBeanApi, sendChatMessage } from './api';
import './coffee.css';

const PROCESS_PROFILES: Record<string, { label: string; className: string }> = {
  washed: { label: 'Washed', className: 'profile-washed' },
  natural: { label: 'Natural', className: 'profile-natural' },
  honey: { label: 'Honey', className: 'profile-honey' },
  anaerobic: { label: 'Anaerobic', className: 'profile-anaerobic' },
  coferment: { label: 'Coferment', className: 'profile-coferment' },
  dark: { label: 'Dark', className: 'profile-dark' }
};

export default function CoffeeApp() {
  const [beans, setBeans] = useState<Record<string, BeanData>>(INITIAL_BEANS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'brew' | 'inventory'>('brew'); 
  const [recipeMode, setRecipeMode] = useState<'espresso' | 'oat' | 'filter'>('espresso'); 
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeConfig, setActiveConfig] = useState<'espresso' | 'oat' | 'pourover' | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [editingOriginalId, setEditingOriginalId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  
  // Interrogation / AI chat
  const [queryInput, setQueryInput] = useState("");
  const [queryLoading, setQueryLoading] = useState(false);
  const [isInterrogateExpanded, setIsInterrogateExpanded] = useState(true);
  const [invLog, setInvLog] = useState<Array<{ q: string; a: string | null }>>([]); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const refresh = async () => {
    try {
      const data = await fetchBeans();
      setBeans(data);
      if (!activeId || !data[activeId]) {
        const first = Object.keys(data).sort().find(k => !data[k].archived) || Object.keys(data)[0];
        if (first) setActiveId(first);
      }
    } catch (e) {
      console.error('Error refreshing beans:', e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (isInterrogateExpanded) {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [queryLoading, invLog.length, activeId, isInterrogateExpanded]);

  const saveBean = async (name: string, data: Partial<BeanData>) => {
    setBeans(prev => {
      const existing = prev[name] || {};
      const updated: BeanData = { ...existing, ...data };
      if (data.espresso) updated.espresso = { ...existing.espresso, ...data.espresso };
      if (data.pourover) updated.pourover = { ...existing.pourover, ...data.pourover };
      if (data.oat) updated.oat = { ...existing.oat, ...data.oat };
      return { ...prev, [name]: updated };
    });

    await upsertBeanApi(name, data);
  };

  const handleDeleteBean = async (beanNameToDelete: string) => {
    if (!beanNameToDelete) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${beanNameToDelete}"?`)) {
      return;
    }
    await deleteBeanApi(beanNameToDelete);
    setBeans(prev => {
      const copy = { ...prev };
      delete copy[beanNameToDelete];
      return copy;
    });
    if (activeId === beanNameToDelete) {
      const remaining = Object.keys(beans).filter(k => k !== beanNameToDelete);
      setActiveId(remaining.length > 0 ? remaining[0] : null);
    }
    if (isEditorOpen) {
      setIsEditorOpen(false);
      setEditingOriginalId(null);
    }
  };

  const handleSaveIdentity = async () => {
    const cleanName = (formData.name || '').trim();
    if (!cleanName) {
      alert("Please enter a bean name.");
      return;
    }

    const payload = { ...formData, name: cleanName };

    // If editing an existing bean and the user renamed it, delete the old bean key first
    if (editingOriginalId && editingOriginalId !== cleanName) {
      await deleteBeanApi(editingOriginalId);
      setBeans(prev => {
        const copy = { ...prev };
        delete copy[editingOriginalId];
        return copy;
      });
    }

    await saveBean(cleanName, payload);
    setActiveId(cleanName);
    setEditingOriginalId(null);
    setIsEditorOpen(false);
  };

  const handleInterrogate = async (isInventory = false) => {
    if (!queryInput.trim()) return;
    const q = queryInput.trim();
    setQueryInput("");
    setQueryLoading(true);
    setIsInterrogateExpanded(true);

    const context = isInventory ? beans : (activeId ? beans[activeId] : null);
    
    if (isInventory) {
      setInvLog(prev => [...prev, { q, a: null }]);
    } else if (activeId) {
      setBeans(prev => {
        const b = prev[activeId];
        const newHistory = [...(b.chatHistory || []), { q, a: null, ts: Date.now() }];
        return { ...prev, [activeId]: { ...b, chatHistory: newHistory } };
      });
    }

    try {
      const answer = await sendChatMessage(q, context);

      if (isInventory) {
        setInvLog(prev => prev.map(e => (e.q === q && e.a === null) ? { ...e, a: answer } : e));
      } else if (activeId) {
        setBeans(prev => {
          const b = prev[activeId];
          const newHistory = (b.chatHistory || []).map(h => (h.q === q && h.a === null) ? { ...h, a: answer } : h);
          upsertBeanApi(activeId, { chatHistory: newHistory });
          return { ...prev, [activeId]: { ...b, chatHistory: newHistory } };
        });
      }
    } catch (e) {
      console.error('Error during interrogation:', e);
    }
    setQueryLoading(false);
  };

  const deleteChatEntry = (idx: number) => {
    if (!activeId) return;
    const currentHistory = [...(beans[activeId]?.chatHistory || [])];
    currentHistory.splice(idx, 1);
    saveBean(activeId, { chatHistory: currentHistory });
  };

  const handleFormNum = (field: string, val: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: val === '' ? '' : val }));
  };
  
  const activeBean: BeanData = (activeId && beans[activeId]) ? beans[activeId] : ({} as BeanData);
  const esp = activeBean.espresso || { 
    dose: activeBean.dose || 18, 
    yield: activeBean.lockedYield || 36, 
    time: activeBean.lockedTime || 28, 
    grind: activeBean.grind || '1.5', 
    temp: activeBean.temp || 93 
  };
  const oat = activeBean.oat || { milk: activeBean.milkVol || 170, yield: 40 }; 
  const po = activeBean.pourover || { dose: 20, water: 320, grind: '5.0', temp: 96, bloom: 45, ratio: 16 };

  const handleDose = (delta: number) => { 
    if (!activeId) return; 
    saveBean(activeId, { doses: Math.max(0, (activeBean.doses || 0) + delta) }); 
  };
  
  const weightKg = Number(activeBean.weight) || 0;
  const espDoseNum = Number(esp.dose) || 18;
  const usedKg = ((activeBean.doses || 0) * espDoseNum) / 1000;
  const remKg = Math.max(0, weightKg - usedKg);
  const remPct = weightKg > 0 ? (remKg / weightKg) * 100 : 0;
  
  const totalStockKg = Object.values(beans).reduce((acc, b) => { 
    if (b.archived) return acc; 
    const w = Number(b.weight) || 0; 
    const u = ((b.doses || 0) * (Number(b.espresso?.dose) || Number(b.dose) || 18)) / 1000; 
    return acc + Math.max(0, w - u); 
  }, 0);

  const runwayDays = (totalStockKg / 0.036).toFixed(0); 
  const profileKey = (activeBean.profile || 'washed').toLowerCase();
  const profileStyle = PROCESS_PROFILES[profileKey] || PROCESS_PROFILES.washed;

  const getRecipeTargets = () => {
    if (recipeMode === 'filter') {
      const ratio = Number(po.ratio) || 16;
      const dose = Number(po.dose) || 20;
      const yieldVal = (dose * ratio).toFixed(0);
      return { 
        main: `${yieldVal}g`, 
        sub: `In: ${dose}g`, 
        time: '3:00', 
        desc: `Bloom ${po.bloom || 45}s`, 
        ratio: `1:${ratio}`,
        grind: po.grind || '5.0', 
        temp: po.temp || 96
      };
    }
    
    // Espresso Base Logic
    const espYield = Number(esp.yield) || 36;
    const espTime = Number(esp.time) || 28;
    const flowRate = (espYield > 0 && espTime > 0) ? (espYield / espTime) : 1.2; 
    
    if (recipeMode === 'oat') {
      const targetYield = Number(oat.yield) || 40;
      const calcTime = (targetYield / flowRate).toFixed(0);
      return {
        main: `${targetYield}g`, 
        sub: `In: ${esp.dose || 18}g`,
        time: `~${calcTime}s`, 
        desc: `+${oat.milk || 170}g Milk`,
        grind: esp.grind || '1.5', 
        temp: esp.temp || 93
      };
    }

    return {
      main: `${espYield}g`, 
      sub: `In: ${esp.dose || 18}g`,
      time: `${espTime}s`, 
      desc: `Flow: ${flowRate.toFixed(1)} g/s`,
      grind: esp.grind || '1.5', 
      temp: esp.temp || 93
    };
  };

  const target = getRecipeTargets();

  return (
    <div className="coffee-app">
      {/* Top Navbar */}
      <nav className="coffee-nav">
        <div className="coffee-nav-container">
          <div className="coffee-brand">
            <div className="coffee-logo-icon">☕</div>
            <div className="coffee-logo-text">
              ESPRESSO<span className="coffee-logo-sub">_AGENT</span>
            </div>
          </div>

          <div className="coffee-nav-links">
            <a href="/" className="coffee-back-link">
              <ArrowLeft size={13} /> gierad.com
            </a>
            <div className="coffee-tabs">
              <button 
                onClick={() => { setView('brew'); setInvLog([]); }} 
                className={`coffee-tab-btn ${view === 'brew' ? 'active' : ''}`}
              >
                Brew
              </button>
              <button 
                onClick={() => { setView('inventory'); setIsInterrogateExpanded(true); }} 
                className={`coffee-tab-btn ${view === 'inventory' ? 'active' : ''}`}
              >
                Inventory
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="coffee-main">
        {view === 'brew' && (
          <>
            {/* Bean Header */}
            <div className="coffee-bean-header">
              <div className="coffee-bean-top">
                <div className="coffee-select-wrapper">
                  <div className="coffee-label">
                    <span>Active Bean</span>
                    <div className="coffee-label-actions">
                      {activeBean.link && (
                        <a href={activeBean.link} target="_blank" rel="noreferrer" className="coffee-link-btn">
                          🔗 WEB
                        </a>
                      )}
                      <button 
                        onClick={() => { 
                          setFormData({ ...activeBean, name: activeId }); 
                          setEditingOriginalId(activeId);
                          setIsEditorOpen(true); 
                        }} 
                        className="coffee-btn-ghost"
                      >
                        ⚙️ ID
                      </button>
                    </div>
                  </div>

                  <div className="coffee-select-custom">
                    <select 
                      value={activeId || ''} 
                      onChange={(e) => setActiveId(e.target.value)} 
                      className="coffee-select"
                    >
                      {Object.keys(beans)
                        .sort()
                        .filter(k => !beans[k].archived)
                        .map(k => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                    <div className="coffee-select-arrow">▼</div>
                  </div>
                </div>

                <div className="coffee-meta-badges">
                  <div className="coffee-badge-card">
                    <div className="coffee-badge-label">Process</div>
                    <div className={`coffee-badge-val ${profileStyle.className}`}>
                      {profileStyle.label}
                    </div>
                  </div>
                  <div className="coffee-badge-card">
                    <div className="coffee-badge-label">Frozen</div>
                    <div className="coffee-badge-val" style={{ color: activeBean.frozen ? '#60a5fa' : '#a1a1aa' }}>
                      {activeBean.frozen ? "YES" : "NO"}
                    </div>
                  </div>
                </div>
              </div>

              {activeBean.notes && (
                <div className="coffee-notes-banner">
                  <span style={{ fontStyle: 'normal', marginRight: '0.5rem' }}>👅</span>
                  {activeBean.notes}
                </div>
              )}
            </div>

            {/* Brew Mode Selector & Target Extraction Card */}
            <div className="coffee-brew-grid">
              <div className="coffee-mode-list">
                {[
                  { id: 'espresso', label: 'Espresso', sub: 'Foundation', icon: '☕' },
                  { id: 'oat', label: 'Oat Latte', sub: 'Spectral Cut', icon: '🥛' },
                  { id: 'filter', label: 'Pour Over', sub: 'Manual', icon: '🏺' }
                ].map(r => (
                  <button 
                    key={r.id} 
                    onClick={() => setRecipeMode(r.id as any)} 
                    className={`coffee-mode-card ${recipeMode === r.id ? 'active' : ''}`}
                  >
                    <span className="coffee-mode-icon">{r.icon}</span>
                    <div>
                      <div className="coffee-mode-title">{r.label}</div>
                      <div className="coffee-mode-sub">{r.sub}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="coffee-target-card">
                <div>
                  <div className="coffee-target-header">
                    <div className="coffee-target-params">
                      <div className="coffee-param-box">
                        <div className="coffee-param-lbl">GRIND</div>
                        <div className="coffee-param-val">{target.grind}</div>
                      </div>
                      <div className="coffee-param-box bordered">
                        <div className="coffee-param-lbl">TEMP</div>
                        <div className="coffee-param-val temp">{target.temp}°C</div>
                      </div>
                    </div>

                    <div className={`coffee-status-pill ${activeBean.frozen ? 'frozen' : ''}`}>
                      <Activity size={13} />
                      {activeBean.frozen ? "DEEP FREEZE" : "FRESH"}
                    </div>
                  </div>

                  <div className="coffee-target-yield">
                    <span className="coffee-yield-main">{target.main}</span>
                    <span className="coffee-yield-sub">{target.sub}</span>
                  </div>

                  <div className="coffee-target-meta">
                    <span className="coffee-chip">
                      <Clock size={13} /> {target.time}
                    </span>
                    <span>•</span>
                    {recipeMode === 'filter' && (
                      <>
                        <span className="coffee-chip">R: {target.ratio}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{target.desc}</span>
                  </div>
                </div>

                <div>
                  {recipeMode === 'espresso' && (
                    <button 
                      onClick={() => { setFormData(esp); setActiveConfig('espresso'); }} 
                      className="coffee-configure-btn"
                    >
                      ⚙️ CONFIGURE SHOT
                    </button>
                  )}
                  {recipeMode === 'oat' && (
                    <button 
                      onClick={() => { setFormData(oat); setActiveConfig('oat'); }} 
                      className="coffee-configure-btn"
                    >
                      ⚙️ CONFIGURE LATTE
                    </button>
                  )}
                  {recipeMode === 'filter' && (
                    <button 
                      onClick={() => { setFormData(po); setActiveConfig('pourover'); }} 
                      className="coffee-configure-btn"
                    >
                      ⚙️ CONFIGURE BREW
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Level & Dose Logger */}
            <div className="coffee-stock-bar">
              <div className="coffee-stock-gauge">
                <div className="coffee-stock-header">
                  <span>Stock Level</span>
                  <span>{remKg.toFixed(3)}kg Rem.</span>
                </div>
                <div className="coffee-progress-bg">
                  <div 
                    className={`coffee-progress-fill ${remPct < 15 ? 'low' : 'normal'}`} 
                    style={{ width: `${Math.min(100, remPct)}%` }}
                  />
                </div>
              </div>

              <div className="coffee-dose-counter">
                <button onClick={() => handleDose(-1)} className="coffee-dose-btn minus">-</button>
                <div className="coffee-dose-display">
                  <div className="coffee-dose-num">{activeBean.doses || 0}</div>
                  <div className="coffee-dose-sub">SHOTS</div>
                </div>
                <button onClick={() => handleDose(1)} className="coffee-dose-btn plus">+</button>
              </div>
            </div>

            {/* Active Bean Interrogation Box */}
            <div className="coffee-interrogate-card">
              <div 
                className="coffee-interrogate-top" 
                onClick={() => setIsInterrogateExpanded(!isInterrogateExpanded)}
              >
                <span className="coffee-interrogate-title">
                  🔎 Bean Data Interrogation
                </span>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                  {isInterrogateExpanded ? '▼' : '▲'}
                </span>
              </div>

              {isInterrogateExpanded && (
                <div className="coffee-interrogate-body">
                  {(!activeBean.chatHistory || activeBean.chatHistory.length === 0) && (
                    <div className="coffee-chat-empty">
                      No queries logged. Ask questions about grind dial-in, flow rate adjustments, or flavor notes below...
                    </div>
                  )}

                  {(activeBean.chatHistory || []).map((entry, i) => (
                    <div key={i} className="coffee-chat-item">
                      <div className="coffee-chat-q">{entry.q}</div>
                      {entry.a === null ? (
                        <div className="coffee-chat-loading">Analyzing extraction...</div>
                      ) : (
                        <div className="coffee-chat-a">
                          <ReactMarkdown>{entry.a}</ReactMarkdown>
                        </div>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteChatEntry(i); }} 
                        className="coffee-chat-del"
                        title="Delete query"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}

              <div className="coffee-interrogate-input-row">
                <input 
                  className="coffee-interrogate-input" 
                  placeholder="Interrogate data..." 
                  value={queryInput} 
                  onChange={e => setQueryInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleInterrogate(false)} 
                  autoComplete="off" 
                />
                <button 
                  onClick={() => handleInterrogate(false)} 
                  disabled={queryLoading} 
                  className="coffee-interrogate-send"
                >
                  ➔
                </button>
              </div>
            </div>
          </>
        )}

        {/* --- INVENTORY VIEW --- */}
        {view === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Stock Statistics */}
            <div className="coffee-inventory-stats">
              <div className="coffee-inv-stat-card">
                <div className="coffee-inv-stat-lbl">Total Stock</div>
                <div className="coffee-inv-stat-num">
                  {totalStockKg.toFixed(2)} <span className="coffee-inv-stat-sub">kg</span>
                </div>
              </div>
              <div className="coffee-inv-stat-card">
                <div className="coffee-inv-stat-lbl">Estimated Runway</div>
                <div className={`coffee-inv-stat-num ${Number(runwayDays) < 7 ? 'danger' : 'safe'}`}>
                  {runwayDays} <span className="coffee-inv-stat-sub">days</span>
                </div>
              </div>
            </div>

            {/* Inventory Controls */}
            <div className="coffee-inv-toolbar">
              <div className="coffee-toolbar-group">
                <button 
                  onClick={() => { 
                    setFormData({}); 
                    setEditingOriginalId(null);
                    setIsEditorOpen(true); 
                  }} 
                  className="coffee-btn-primary"
                >
                  <Plus size={14} /> ADD BEAN
                </button>
                <button 
                  onClick={() => setShowArchived(!showArchived)} 
                  className={`coffee-btn-secondary ${showArchived ? 'active' : ''}`}
                >
                  {showArchived ? <EyeOff size={14} /> : <Eye size={14} />} 
                  {showArchived ? 'HIDE ARCHIVED' : 'SHOW ARCHIVED'}
                </button>
              </div>

              <div className="coffee-toolbar-group">
                <button 
                  onClick={() => { 
                    const blob = new Blob([JSON.stringify(beans, null, 2)], { type: 'application/json' }); 
                    const url = URL.createObjectURL(blob); 
                    const a = document.createElement('a'); 
                    a.href = url; 
                    a.download = `EspressoFFT_Backup_${new Date().toISOString().slice(0,10)}.json`; 
                    a.click(); 
                  }} 
                  className="coffee-btn-secondary"
                >
                  <Save size={14} /> BACKUP
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="coffee-btn-secondary"
                >
                  <FolderOpen size={14} /> RESTORE
                </button>
                <input 
                  type="file" 
                  className="hidden" 
                  style={{ display: 'none' }}
                  ref={fileInputRef} 
                  onChange={e => { 
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const r = new FileReader(); 
                    r.onload = async (ev) => { 
                      try {
                        const parsed = JSON.parse(ev.target?.result as string); 
                        await saveAllBeansApi(parsed);
                        await refresh();
                      } catch (err) {
                        alert("Invalid backup JSON file.");
                      }
                    }; 
                    r.readAsText(file); 
                  }} 
                />
              </div>
            </div>

            {/* Bean Inventory Cards */}
            <div className="coffee-inv-list">
              {Object.keys(beans).sort().map(id => {
                const b = beans[id];
                if (b.archived && !showArchived) return null;
                const bEspDose = Number(b.espresso?.dose) || Number(b.dose) || 18;
                const bRemKg = (Number(b.weight) || 0) - (((b.doses || 0) * bEspDose) / 1000);
                
                return (
                  <div key={id} className={`coffee-inv-item ${b.archived ? 'archived' : ''}`}>
                    <div>
                      <div className="coffee-inv-item-name">
                        {id} 
                        {b.archived && <span className="coffee-archived-pill">ARCHIVED</span>}
                        {b.frozen && <Snowflake size={14} style={{ color: '#60a5fa' }} />}
                      </div>
                      <div className="coffee-inv-item-meta">
                        <span>{Math.max(0, bRemKg).toFixed(2)}kg remaining</span>
                        <span>•</span>
                        <span>Roast: {b.roastDate || 'N/A'}</span>
                        <span>•</span>
                        <span style={{ textTransform: 'capitalize' }}>{b.profile || 'Washed'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button 
                        onClick={() => { 
                          setFormData({ ...b, name: id }); 
                          setEditingOriginalId(id);
                          setIsEditorOpen(true); 
                        }} 
                        className="coffee-btn-secondary"
                      >
                        ⚙️ EDIT
                      </button>
                      <button 
                        onClick={() => handleDeleteBean(id)} 
                        className="coffee-btn-icon-danger"
                        title={`Delete ${id}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inventory Intelligence Interrogation Box */}
            <div className="coffee-interrogate-card" style={{ marginTop: '1rem' }}>
              <div className="coffee-interrogate-top">
                <span className="coffee-interrogate-title">
                  🔎 Inventory Intelligence
                </span>
                {invLog.length > 0 && (
                  <button 
                    onClick={() => setInvLog([])} 
                    style={{ background: 'none', border: 'none', color: '#71717a', fontSize: '0.65rem', cursor: 'pointer' }}
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {invLog.length > 0 && (
                <div className="coffee-interrogate-body">
                  {invLog.map((entry, i) => (
                    <div key={i} className="coffee-chat-item">
                      <div className="coffee-chat-q">{entry.q}</div>
                      {entry.a === null ? (
                        <div className="coffee-chat-loading">Computing inventory metrics...</div>
                      ) : (
                        <div className="coffee-chat-a">
                          <ReactMarkdown>{entry.a}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}

              <div className="coffee-interrogate-input-row">
                <input 
                  className="coffee-interrogate-input" 
                  placeholder="Interrogate inventory..." 
                  value={queryInput} 
                  onChange={e => setQueryInput(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleInterrogate(true)} 
                  autoComplete="off" 
                />
                <button 
                  onClick={() => handleInterrogate(true)} 
                  disabled={queryLoading} 
                  className="coffee-interrogate-send"
                >
                  ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- IDENTITY / EDIT BEAN MODAL --- */}
        {isEditorOpen && (
          <div className="coffee-modal-overlay">
            <div className="coffee-modal-box">
              <div className="coffee-modal-header">
                <span className="coffee-modal-title">IDENTITY CONFIG</span>
                <button onClick={() => setIsEditorOpen(false)} className="coffee-btn-ghost">
                  CLOSE
                </button>
              </div>

              <div className="coffee-modal-body">
                <div className="coffee-form-group">
                  <label className="coffee-label">Bean Name / ID</label>
                  <input 
                    className="coffee-input" 
                    value={formData.name || ''} 
                    onChange={e => handleFormNum('name', e.target.value)} 
                    placeholder="e.g. Candy Hearts Colombia"
                  />
                </div>

                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">Bag Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="coffee-input" 
                      value={formData.weight === undefined ? '' : formData.weight} 
                      onChange={e => handleFormNum('weight', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">Roast Date</label>
                    <input 
                      type="date" 
                      className="coffee-input" 
                      value={formData.roastDate || ''} 
                      onChange={e => handleFormNum('roastDate', e.target.value)} 
                    />
                  </div>
                </div>

                <div className="coffee-form-group">
                  <label className="coffee-label">Store / Roaster URL</label>
                  <input 
                    className="coffee-input" 
                    value={formData.link || ''} 
                    onChange={e => handleFormNum('link', e.target.value)} 
                    placeholder="https://..."
                  />
                </div>

                <div className="coffee-form-group">
                  <label className="coffee-label">Flavor Notes</label>
                  <input 
                    className="coffee-input" 
                    value={formData.notes || ''} 
                    onChange={e => handleFormNum('notes', e.target.value)} 
                    placeholder="Strawberry Jam, Bubblegum, Mint..." 
                  />
                </div>

                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">Process</label>
                    <select 
                      className="coffee-input" 
                      value={formData.profile || 'washed'} 
                      onChange={e => handleFormNum('profile', e.target.value)}
                    >
                      {Object.keys(PROCESS_PROFILES).map(k => (
                        <option key={k} value={k}>
                          {PROCESS_PROFILES[k].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center', paddingTop: '0.75rem' }}>
                    <label className="coffee-checkbox-row">
                      <input 
                        type="checkbox" 
                        className="coffee-checkbox" 
                        checked={formData.frozen || false} 
                        onChange={e => setFormData({ ...formData, frozen: e.target.checked })} 
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd' }}>DEEP FREEZE</span>
                    </label>

                    <label className="coffee-checkbox-row">
                      <input 
                        type="checkbox" 
                        className="coffee-checkbox" 
                        checked={formData.archived || false} 
                        onChange={e => setFormData({ ...formData, archived: e.target.checked })} 
                      />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f87171' }}>ARCHIVED</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="coffee-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {editingOriginalId && (
                    <button 
                      type="button" 
                      onClick={() => handleDeleteBean(editingOriginalId)} 
                      className="coffee-btn-danger"
                    >
                      <Trash2 size={14} /> DELETE BEAN
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button 
                    onClick={() => { setIsEditorOpen(false); setEditingOriginalId(null); }} 
                    className="coffee-btn-cancel"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={handleSaveIdentity} 
                    className="coffee-btn-save"
                  >
                    SAVE BEAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ESPRESSO CONFIG MODAL --- */}
        {activeConfig === 'espresso' && (
          <div className="coffee-modal-overlay">
            <div className="coffee-modal-box" style={{ maxWidth: '380px' }}>
              <div className="coffee-modal-header">
                <span className="coffee-modal-title">SHOT SETTINGS</span>
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-ghost">CLOSE</button>
              </div>
              <div className="coffee-modal-body">
                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">DOSE (g)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.dose ?? ''} 
                      onChange={e => handleFormNum('dose', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">YIELD (g)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.yield ?? ''} 
                      onChange={e => handleFormNum('yield', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                </div>

                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">TIME (s)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.time ?? ''} 
                      onChange={e => handleFormNum('time', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">TEMP (°C)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.temp ?? ''} 
                      onChange={e => handleFormNum('temp', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                </div>

                <div className="coffee-form-group">
                  <label className="coffee-label">GRIND</label>
                  <input 
                    type="text" 
                    className="coffee-input" 
                    value={formData.grind ?? ''} 
                    onChange={e => handleFormNum('grind', e.target.value)} 
                  />
                </div>
              </div>

              <div className="coffee-modal-footer">
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-cancel">CANCEL</button>
                <button 
                  onClick={() => { 
                    if (activeId) saveBean(activeId, { espresso: formData }); 
                    setActiveConfig(null); 
                  }} 
                  className="coffee-btn-save"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- OAT CONFIG MODAL --- */}
        {activeConfig === 'oat' && (
          <div className="coffee-modal-overlay">
            <div className="coffee-modal-box" style={{ maxWidth: '380px' }}>
              <div className="coffee-modal-header">
                <span className="coffee-modal-title">LATTE SETTINGS</span>
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-ghost">CLOSE</button>
              </div>
              <div className="coffee-modal-body">
                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">MILK VOL (g)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.milk ?? ''} 
                      onChange={e => handleFormNum('milk', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">YIELD (g)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.yield ?? ''} 
                      onChange={e => handleFormNum('yield', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                </div>
              </div>

              <div className="coffee-modal-footer">
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-cancel">CANCEL</button>
                <button 
                  onClick={() => { 
                    if (activeId) saveBean(activeId, { oat: formData }); 
                    setActiveConfig(null); 
                  }} 
                  className="coffee-btn-save"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- POUR OVER CONFIG MODAL --- */}
        {activeConfig === 'pourover' && (
          <div className="coffee-modal-overlay">
            <div className="coffee-modal-box" style={{ maxWidth: '380px' }}>
              <div className="coffee-modal-header">
                <span className="coffee-modal-title">FILTER SETTINGS</span>
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-ghost">CLOSE</button>
              </div>
              <div className="coffee-modal-body">
                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">DOSE (g)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.dose ?? ''} 
                      onChange={e => handleFormNum('dose', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">RATIO (1:x)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.ratio ?? ''} 
                      onChange={e => handleFormNum('ratio', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                </div>

                <div className="coffee-form-grid-2">
                  <div className="coffee-form-group">
                    <label className="coffee-label">BLOOM (s)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.bloom ?? ''} 
                      onChange={e => handleFormNum('bloom', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                  <div className="coffee-form-group">
                    <label className="coffee-label">TEMP (°C)</label>
                    <input 
                      type="number" 
                      className="coffee-input" 
                      value={formData.temp ?? ''} 
                      onChange={e => handleFormNum('temp', parseFloat(e.target.value) || '')} 
                    />
                  </div>
                </div>

                <div className="coffee-form-group">
                  <label className="coffee-label">GRIND</label>
                  <input 
                    type="text" 
                    className="coffee-input" 
                    value={formData.grind ?? ''} 
                    onChange={e => handleFormNum('grind', e.target.value)} 
                  />
                </div>
              </div>

              <div className="coffee-modal-footer">
                <button onClick={() => setActiveConfig(null)} className="coffee-btn-cancel">CANCEL</button>
                <button 
                  onClick={() => { 
                    if (activeId) saveBean(activeId, { pourover: formData }); 
                    setActiveConfig(null); 
                  }} 
                  className="coffee-btn-save"
                >
                  SAVE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
