'use client'

import { useEffect, useState } from 'react'

const SEED_CONTRACTS = {
  "contracts": [
    {
      "id": "6c2e292314",
      "contractId": "WLA-001",
      "name": "Absa",
      "entity": "WLA",
      "relatedParty": "No",
      "type": "Intermediary Agreement",
      "counterparty": "Absa",
      "start": "2024-04-04",
      "startRaw": "2024-04-04",
      "end": null,
      "endRaw": "No date",
      "noticeDays": "60",
      "renewalDate": "2024-11-01",
      "autoRenew": "Yes",
      "termination": "60-day notice required",
      "payment": "Monthly",
      "value": "12000",
      "paAuth": "",
      "annualRenewal": "",
      "signed": "",
      "owner": "Betty Masemula",
      "notes": "Review contract Q4 Ongoing Supplier",
      "docLink": "",
      "archived": false,
      "dq": ["end:narrative:No date"],
      "history": [
        {
          "ts": "2026-08-26T14:11:10.488Z",
          "user": "Unidentified user",
          "action": "Amended",
          "field": "owner",
          "detail": "\"John Doe\" → \"Betty Masemula\""
        }
      ]
    }
  ]
}

export default function Home() {
  const [db, setDb] = useState(null)
  const [view, setView] = useState('dash')

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

  const live = db.contracts.filter((c) => !c.archived)

  return (
    <>
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

      <nav id="nav">
        <a className={view === 'dash' ? 'on' : ''} onClick={() => setView('dash')} style={{cursor: 'pointer'}}>Dashboard</a>
        <a className={view === 'reg' ? 'on' : ''} onClick={() => setView('reg')} style={{cursor: 'pointer'}}>Contract Register</a>
        <a className={view === 'alerts' ? 'on' : ''} onClick={() => setView('alerts')} style={{cursor: 'pointer'}}>Renewals & Alerts</a>
        <a className={view === 'rp' ? 'on' : ''} onClick={() => setView('rp')} style={{cursor: 'pointer'}}>Related Party</a>
        <a className={view === 'arch' ? 'on' : ''} onClick={() => setView('arch')} style={{cursor: 'pointer'}}>Archive</a>
        <a className={view === 'audit' ? 'on' : ''} onClick={() => setView('audit')} style={{cursor: 'pointer'}}>Audit Trail</a>
        <a className={view === 'dq' ? 'on' : ''} onClick={() => setView('dq')} style={{cursor: 'pointer'}}>Data Quality</a>
        <a className={view === 'help' ? 'on' : ''} onClick={() => setView('help')} style={{cursor: 'pointer'}}>PA / Governance Notes</a>
      </nav>

      <main id="main">
        {view === 'dash' && (
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
        )}

        {view === 'reg' && (
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
        )}

        {view === 'alerts' && (
          <div className="panel">
            <h2>Renewals & Alerts</h2>
            <p className="muted">Review contracts expiring within 90 days.</p>
          </div>
        )}

        {view === 'rp' && (
          <div className="panel">
            <h2>Related-party Contracts — {db.contracts.filter((c) => c.relatedParty === 'Yes' && !c.archived).length}</h2>
            <p className="muted">Intra-group and connected-party arrangements.</p>
          </div>
        )}

        {view === 'arch' && (
          <div className="panel">
            <h2>Archive — {db.contracts.filter((c) => c.archived).length} contracts</h2>
            <p className="muted">Archived records retained in full with their history.</p>
          </div>
        )}

        {view === 'audit' && (
          <div className="panel">
            <h2>Audit Trail — {db.log.length} events</h2>
            <p className="muted">Immutable, append-only record of all changes.</p>
          </div>
        )}

        {view === 'dq' && (
          <div className="panel">
            <h2>Data Quality & PA Readiness</h2>
            <p className="muted">Clear legacy issues before presenting the register to the Prudential Authority.</p>
          </div>
        )}

        {view === 'help' && (
          <div className="panel">
            <h2>PA / Governance Notes</h2>
            <h3>Joint Standard 1 of 2024 (Outsourcing by insurers)</h3>
            <p className="muted">
              Maintain an up-to-date register of all outsourcing arrangements, including intra-group, with review and
              termination provisions.
            </p>
          </div>
        )}
      </main>

      <div id="toast" className="toast"></div>
    </>
  )
}
