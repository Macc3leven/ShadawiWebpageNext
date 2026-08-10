"use client";

import { useState, useRef, useEffect } from 'react'
import {
  useAccount,
  useBalance,
  useDisconnect,
  useConnect,
  useChainId,
  useChains,
} from 'wagmi'
import { formatEther } from 'viem'
import styles from './WalletButton.module.css'

function truncate(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { disconnect } = useDisconnect()
  const { connect, connectors, isPending } = useConnect()
  const chainId = useChainId()
  const chains = useChains()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const chain = chains.find((c) => c.id === chainId)
  const eth = balance
    ? parseFloat(formatEther(balance.value)).toFixed(3)
    : null

  useEffect(() => {
    function onOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  // ── Not connected ──────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className={styles.root} ref={ref}>
        <button
          className={`${styles.btn} ${styles.disconnected}`}
          onClick={() => setOpen((v) => !v)}
        >
          Please Connect
        </button>

        {open && (
          <div className={styles.dropdown}>
            <p className={styles.dropLabel}>Connect wallet</p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                className={styles.connectorBtn}
                disabled={isPending}
                onClick={() => {
                  connect({ connector })
                  setOpen(false)
                }}
              >
                {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Connected ──────────────────────────────────────────────────────────────
  return (
    <div className={styles.root} ref={ref}>
      <button
        className={`${styles.btn} ${styles.connected}`}
        onClick={() => setOpen((v) => !v)}
      >
        ♦ {eth ?? '—'} ETH
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Address</span>
            <span className={styles.infoValue}>{truncate(address)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Balance</span>
            <span className={styles.infoValue}>{eth ?? '—'} ETH</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Network</span>
            <span className={styles.networkBadge}>
              {chain?.name ?? 'Unknown'}
            </span>
          </div>
          <hr className={styles.divider} />
          <button
            className={styles.disconnectBtn}
            onClick={() => {
              disconnect()
              setOpen(false)
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}
