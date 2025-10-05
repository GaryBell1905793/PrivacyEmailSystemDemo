import React, { useEffect, useMemo, useState } from 'react'
import { BrowserProvider, Contract } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config/contracts'
import './index.css'
import { IS_DEMO } from './config/app'

export default function App() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState('')
  const [activeTab, setActiveTab] = useState('compose')

  // Email composition state
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  
  // Email management state
  const [receivedEmails, setReceivedEmails] = useState([])
  const [sentEmails, setSentEmails] = useState([])
  const [status, setStatus] = useState('')

  const contract = useMemo(() => {
    if (!signer) return null
    try {
      return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    } catch {
      return null
    }
  }, [signer])

  useEffect(() => {
    if (!window.ethereum) return
    const prov = new BrowserProvider(window.ethereum)
    setProvider(prov)
  }, [])

  useEffect(() => {
    if (account && contract) {
      loadEmails()
    }
  }, [account, contract])

  async function connect() {
    if (!provider) return
    await provider.send('eth_requestAccounts', [])
    const s = await provider.getSigner()
    setSigner(s)
    setAccount(await s.getAddress())
  }

  async function loadEmails() {
    if (!contract || !account) return
    
    try {
      const [received, sent] = await Promise.all([
        contract.getUserEmails(account),
        contract.getSentEmails(account)
      ])
      
      setReceivedEmails(received)
      setSentEmails(sent)
    } catch (e) {
      console.error('Failed to load emails:', e)
      setStatus('Failed to load emails')
    }
  }

  async function sendEmail() {
    if (!contract || !recipient || !subject || !content) {
      setStatus('Please fill all fields')
      return
    }

    try {
      setStatus('Sending email...')
      
      if (IS_DEMO) {
        const tx = await contract.sendPlainEmail(recipient, subject, content)
        await tx.wait()
        setStatus('Email sent successfully!')
        
        // Clear form
        setRecipient('')
        setSubject('')
        setContent('')
        
        // Reload emails
        await loadEmails()
      } else {
        // Production: integrate @fhevm/sdk to create externalEuint32 + attestation
        throw new Error('Production FHE path disabled (set IS_DEMO=false to enable)')
      }
    } catch (e) {
      console.error(e)
      setStatus(`Send failed: ${e?.reason || e?.message || 'unknown error'}`)
    }
  }

  async function markAsRead(emailId) {
    if (!contract) return
    
    try {
      setStatus('Marking as read...')
      const tx = await contract.markAsRead(emailId)
      await tx.wait()
      setStatus('Email marked as read')
      await loadEmails()
    } catch (e) {
      console.error(e)
      setStatus('Failed to mark as read')
    }
  }

  async function deleteEmail(emailId) {
    if (!contract) return
    
    try {
      setStatus('Deleting email...')
      const tx = await contract.deleteEmail(emailId)
      await tx.wait()
      setStatus('Email deleted')
      await loadEmails()
    } catch (e) {
      console.error(e)
      setStatus('Failed to delete email')
    }
  }

  function formatAddress(address) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  function formatTimestamp(timestamp) {
    return new Date(Number(timestamp) * 1000).toLocaleString()
  }

  function getStateText(state) {
    switch (state) {
      case 0: return 'Sent'
      case 1: return 'Read'
      case 2: return 'Deleted'
      default: return 'Unknown'
    }
  }

  function getStateColor(state) {
    switch (state) {
      case 0: return '#f59e0b' // yellow
      case 1: return '#10b981' // green
      case 2: return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔒 Privacy Email System</h1>
        <div className="wallet-section">
          <button onClick={connect} className="connect-btn">
            {account ? `Connected: ${formatAddress(account)}` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      {account && (
        <div className="main-content">
          <nav className="tabs">
            <button 
              className={activeTab === 'compose' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('compose')}
            >
              ✉️ Compose
            </button>
            <button 
              className={activeTab === 'inbox' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('inbox')}
            >
              📥 Inbox ({receivedEmails.length})
            </button>
            <button 
              className={activeTab === 'sent' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('sent')}
            >
              📤 Sent ({sentEmails.length})
            </button>
          </nav>

          {activeTab === 'compose' && (
            <div className="card">
              <h2>Compose Email</h2>
              <div className="form-group">
                <label>To:</label>
                <input 
                  type="text" 
                  placeholder="Recipient address (0x...)" 
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Subject:</label>
                <input 
                  type="text" 
                  placeholder="Email subject" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea 
                  placeholder="Your message content..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows="6"
                />
              </div>
              <button onClick={sendEmail} className="send-btn">
                Send Email
              </button>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="card">
              <h2>Inbox</h2>
              {receivedEmails.length === 0 ? (
                <p className="empty-state">No emails received yet</p>
              ) : (
                <div className="email-list">
                  {receivedEmails.map((email, index) => (
                    <div key={index} className="email-item">
                      <div className="email-header">
                        <div className="email-info">
                          <span className="sender">{formatAddress(email.sender)}</span>
                          <span className="subject">{email.subject}</span>
                          <span className="timestamp">{formatTimestamp(email.timestamp)}</span>
                        </div>
                        <div className="email-actions">
                          <span 
                            className="state-badge" 
                            style={{ backgroundColor: getStateColor(email.state) }}
                          >
                            {getStateText(email.state)}
                          </span>
                          {email.state === 0 && (
                            <button 
                              onClick={() => markAsRead(email.emailId)}
                              className="action-btn read-btn"
                            >
                              Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => deleteEmail(email.emailId)}
                            className="action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sent' && (
            <div className="card">
              <h2>Sent Emails</h2>
              {sentEmails.length === 0 ? (
                <p className="empty-state">No emails sent yet</p>
              ) : (
                <div className="email-list">
                  {sentEmails.map((email, index) => (
                    <div key={index} className="email-item">
                      <div className="email-header">
                        <div className="email-info">
                          <span className="recipient">To: {formatAddress(email.recipient)}</span>
                          <span className="subject">{email.subject}</span>
                          <span className="timestamp">{formatTimestamp(email.timestamp)}</span>
                        </div>
                        <div className="email-actions">
                          <span 
                            className="state-badge" 
                            style={{ backgroundColor: getStateColor(email.state) }}
                          >
                            {getStateText(email.state)}
                          </span>
                          <button 
                            onClick={() => deleteEmail(email.emailId)}
                            className="action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  )
}
