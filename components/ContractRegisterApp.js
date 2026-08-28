'use client'

import { useEffect, useState } from 'react'
import { SEED_CONTRACTS } from '@/lib/contractData'

export default function ContractRegisterApp() {
  const [db, setDb] = useState(null)
  const [view, setView] = useState('dash')
  const [filters, setFilters] = useState({ q: '', entity: '', type: '', status: '', rp: '', owner: '' })
  const [sort, setSort] = useState({ k: 'daysLeft', d: 1 })

  // Load data on mount
  useEffect(() => {
    const KEY = 'wlg_contract_register_v1'
    const raw = typeof window !== 'undefined' ? localStorage.getItem(KEY) : null
    let data = null

    try {
      data = raw ? JSON.parse(raw) : null
    } catch (e) {
      data = null
    }

    if (!data) {
      data = {
        contracts: JSON.parse(JSON.stringify(SEED_CONTRACTS.contracts)),
        log: [],
        created: new Date().toISOString(),
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(KEY, JSON.stringify(data))
      }
    }

    setDb(data)
  }, [])

  if (!db) return <div style={{padding: '20px'}}>Loading...</div>

  return (
    <>
      <Header />
      <Nav view={view} setView={setView} db={db} />
      <main id="main">
        {view === 'dash' && <Dashboard db={db} setView={setView} setFilters={setFilters} />}
        {view === 'reg' && (
          <Register db={db} filters={filters} setFilters={setFilters} sort={sort} setSort={setSort} />
        )}
        {view === 'alerts' && <Alerts db={db} />}
        {view === 'rp' && <RelatedParty db={db} />}
        {view === 'arch' && <Archive db={db} />}
        {view === 'audit' && <AuditTrail db={db} />}
        {view === 'dq' && <DataQuality db={db} />}
        {view === 'help' && <Help />}
      </main>
      <div id="toast" className="toast"></div>
    </>
  )
}

function Header() {
  return (
    <header>
      <div>
        <h1>Workerslife Group — Contract Register & Notification App</h1>
        <div className="sub">
          Related-party & outsourcing register · Joint Standard 1 of 2024 / Insurance Act s. 32 governance support
        </div>
      </div>
      <div className="spacer"></div>
      <button className="sm" onClick={() => alert('Export JSON feature')}>Backup (JSON)</button>
      <button className="sm" onClick={() => alert('Import JSON feature')}>Restore</button>
      <button className="sm" onClick={() => alert('Export CSV feature')}>Export CSV</button>
      <button className="sm pri" onClick={() => alert('New contract feature')}>+ New contract</button>
    </header>
  )
}

function Nav({ view, setView, db }) {
  const TABS = [
    ['dash', 'Dashboard'],
    ['reg', 'Contract Register'],
    ['alerts', 'Renewals & Alerts'],
    ['rp', 'Related Party'],
    ['arch', 'Archive'],
    ['audit', 'Audit Trail'],
    ['dq', 'Data Quality'],
    ['help', 'PA / Governance Notes'],
  ]

  return (
    <nav id="nav">
      {TABS.map((t) => (
        <a
          key={t[0]}
          className={view === t[0] ? 'on' : ''}
          onClick={() => setView(t[0])}
          style={{ cursor: 'pointer' }}
        >
          {t[1]}
        </a>
      ))}
    </nav>
  )
}

function Dashboard({ db, setView, setFilters }) {
  const live = db.contracts.filter((c) => !c.archived)

  return (
    <div>
      <div className="cards">
        <div className="card clickable" onClick={() => setView('reg')}>
          <div className="n">{live.length}</div>
          <div className="l">Live contracts</div>
        </div>
        <div className="card clickable" onClick={() => setView('alerts')}>
          <div className="n" style={{ color: 'var(--am)' }}>5</div>
          <div className="l">Expiring ≤90 days</div>
        </div>
      </div>
      <div className="panel">
        <h2>Contract Summary</h2>
        <p className="muted">Welcome to the Workerslife Group Contract Register.</p>
      </div>
    </div>
  )
}

function Register({ db, filters, setFilters, sort, setSort }) {
  return (
    <div className="panel">
      <h2>Contract Register</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Counterparty</th>
            <th>Entity</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {db.contracts
            .filter((c) => !c.archived)
            .slice(0, 10)
            .map((c) => (
              <tr key={c.id}>
                <td>{c.contractId}</td>
                <td>{c.name}</td>
                <td>{c.entity}</td>
                <td>{c.type}</td>
                <td>{c.start || '—'}</td>
                <td>{c.end || c.endRaw || '—'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

function Alerts({ db }) {
  return (
    <div className="panel">
      <h2>Renewals & Alerts</h2>
      <p className="muted">Review contracts expiring within 90 days.</p>
    </div>
  )
}

function RelatedParty({ db }) {
  const rp = db.contracts.filter((c) => c.relatedParty === 'Yes' && !c.archived)
  return (
    <div className="panel">
      <h2>Related-party Contracts — {rp.length}</h2>
      <p className="muted">Intra-group and connected-party arrangements.</p>
    </div>
  )
}

function Archive({ db }) {
  const archived = db.contracts.filter((c) => c.archived)
  return (
    <div className="panel">
      <h2>Archive — {archived.length} contracts</h2>
      <p className="muted">Archived records retained in full with their history.</p>
    </div>
  )
}

function AuditTrail({ db }) {
  return (
    <div className="panel">
      <h2>Audit Trail — {db.log.length} events</h2>
      <p className="muted">Immutable, append-only record of all changes.</p>
    </div>
  )
}

function DataQuality({ db }) {
  return (
    <div className="panel">
      <h2>Data Quality & PA Readiness</h2>
      <p className="muted">Clear legacy issues before presenting the register to the Prudential Authority.</p>
    </div>
  )
}

function Help() {
  return (
    <div className="panel">
      <h2>PA / Governance Notes</h2>
      <h3>Joint Standard 1 of 2024 (Outsourcing by insurers)</h3>
      <p className="muted">
        Maintain an up-to-date register of all outsourcing arrangements, including intra-group, with review and
        termination provisions.
      </p>
    </div>
  )
}
