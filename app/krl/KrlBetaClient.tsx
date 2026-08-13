"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BASE_SEPOLIA,
  DEFAULT_KRL_CONFIG,
  ensureBaseSepolia,
  formatTokenAmount,
  isValidAddress,
  normalizeChainId,
  readTokenBalance,
  shortenAddress,
  validateRuntimeConfig,
  walletErrorMessage,
} from "./wallet.js";

type Eip1193Provider = {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

type KrlConfig = typeof DEFAULT_KRL_CONFIG & {
  status: "predeploy" | "deployed";
  token: typeof DEFAULT_KRL_CONFIG.token & { contractAddress: string | null };
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

function Brand({ assetBasePath }: { assetBasePath: string }) {
  return (
    <a className="beta-brand" href={`${assetBasePath}/`} aria-label="Torna al sito Kreluna">
      <Image src={`${assetBasePath}/kreluna-logo.png`} alt="" width={28} height={28} unoptimized />
      <span>KRELUNA</span>
    </a>
  );
}

export default function KrlBetaClient({ assetBasePath }: { assetBasePath: string }) {
  const [config, setConfig] = useState<KrlConfig>(() => validateRuntimeConfig(DEFAULT_KRL_CONFIG) as KrlConfig);
  const [configNotice, setConfigNotice] = useState("");
  const [provider, setProvider] = useState<Eip1193Provider | null>(() => (
    typeof window === "undefined" ? null : window.ethereum ?? null
  ));
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletNotice, setWalletNotice] = useState("Wallet non collegato");
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [demoKrl, setDemoKrl] = useState(0);
  const [demoCredits, setDemoCredits] = useState(0);
  const [demoNotice, setDemoNotice] = useState("Carica il saldo dimostrativo per iniziare.");

  const networkReady = chainId === BASE_SEPOLIA.chainId;
  const contractReady = isValidAddress(config.token.contractAddress);

  useEffect(() => {
    const handleProviderInjection = () => setProvider(window.ethereum ?? null);
    window.addEventListener("ethereum#initialized", handleProviderInjection, { once: true });
    return () => window.removeEventListener("ethereum#initialized", handleProviderInjection);
  }, []);

  useEffect(() => {
    let active = true;
    if (!account || chainId !== BASE_SEPOLIA.chainId || !isValidAddress(config.token.contractAddress)) {
      return () => { active = false; };
    }
    void readTokenBalance(config, account)
      .then((raw) => {
        if (active) setBalance(formatTokenAmount(raw, config.token.decimals));
      })
      .catch(() => {
        if (!active) return;
        setBalance(null);
        setWalletNotice("Saldo temporaneamente non disponibile.");
      });
    return () => { active = false; };
  }, [account, chainId, config]);

  useEffect(() => {
    let active = true;
    fetch(`${assetBasePath}/krl-config.json`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Configurazione non disponibile.");
        return response.json();
      })
      .then((value) => validateRuntimeConfig(value) as KrlConfig)
      .then((value) => {
        if (!active) return;
        setBalance(null);
        setConfig(value);
        setConfigNotice("");
      })
      .catch(() => {
        if (!active) return;
        setConfig(validateRuntimeConfig(DEFAULT_KRL_CONFIG) as KrlConfig);
        setBalance(null);
        setConfigNotice("Configurazione protetta: contratto mantenuto disattivato.");
      });
    return () => { active = false; };
  }, [assetBasePath]);

  useEffect(() => {
    if (!provider?.on || !provider.removeListener) return;
    const handleAccounts = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? args[0] : [];
      const next = typeof accounts[0] === "string" && isValidAddress(accounts[0]) ? accounts[0] : null;
      setAccount(next);
      setBalance(null);
      setWalletNotice(next ? "Wallet collegato" : "Wallet scollegato");
    };
    const handleChain = (...args: unknown[]) => {
      const next = normalizeChainId(args[0]);
      setChainId(next);
      setBalance(null);
      setWalletNotice(next === BASE_SEPOLIA.chainId ? "Base Sepolia attiva" : "Passa a Base Sepolia per continuare");
    };
    const handleDisconnect = () => {
      setAccount(null);
      setChainId(null);
      setBalance(null);
      setWalletNotice("Wallet scollegato");
    };
    provider.on("accountsChanged", handleAccounts);
    provider.on("chainChanged", handleChain);
    provider.on("disconnect", handleDisconnect);
    return () => {
      provider.removeListener?.("accountsChanged", handleAccounts);
      provider.removeListener?.("chainChanged", handleChain);
      provider.removeListener?.("disconnect", handleDisconnect);
    };
  }, [provider]);

  const connectWallet = async () => {
    if (!provider) {
      setWalletNotice("Apri questa pagina in un wallet compatibile, come Coinbase Wallet o MetaMask.");
      return;
    }
    setBusy(true);
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const nextAccount = Array.isArray(accounts) && typeof accounts[0] === "string" && isValidAddress(accounts[0])
        ? accounts[0]
        : null;
      const rawChainId = await provider.request({ method: "eth_chainId" });
      const nextChainId = normalizeChainId(rawChainId);
      setAccount(nextAccount);
      setChainId(nextChainId);
      setBalance(null);
      setWalletNotice(nextChainId === BASE_SEPOLIA.chainId ? "Wallet collegato su Base Sepolia" : "Wallet collegato: ora passa a Base Sepolia");
    } catch (error) {
      setWalletNotice(walletErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const switchNetwork = async () => {
    if (!provider) {
      setWalletNotice("Nessun wallet compatibile rilevato.");
      return;
    }
    setBusy(true);
    try {
      const activeChainId = await ensureBaseSepolia(provider);
      setBalance(null);
      setChainId(activeChainId);
      setWalletNotice("Base Sepolia attiva");
    } catch (error) {
      setWalletNotice(walletErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const addToken = async () => {
    if (!provider || !contractReady) return;
    setBusy(true);
    try {
      const activeChainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
      setChainId(activeChainId);
      if (activeChainId !== BASE_SEPOLIA.chainId) {
        setBalance(null);
        setWalletNotice("Passa a Base Sepolia prima di aggiungere KRL Beta.");
        return;
      }
      const accepted = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: config.token.contractAddress,
            symbol: config.token.symbol,
            decimals: config.token.decimals,
            image: config.token.logoUrl,
          },
        },
      });
      setWalletNotice(accepted ? "KRL Beta aggiunto al wallet" : "Aggiunta del token non completata");
    } catch (error) {
      setWalletNotice(walletErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const loadDemo = () => {
    setDemoKrl(1000);
    setDemoCredits(0);
    setDemoNotice("Hai caricato 1.000 KRL dimostrativi. Non sono token on-chain.");
  };

  const spendDemo = () => {
    if (demoKrl < 100) return;
    setDemoKrl((current) => current - 100);
    setDemoCredits((current) => current + 10);
    setDemoNotice("Simulazione completata: 100 KRL demo → 10 crediti AI demo.");
  };

  const resetDemo = () => {
    setDemoKrl(0);
    setDemoCredits(0);
    setDemoNotice("Demo azzerata. Nessun dato o valore è stato trasferito.");
  };

  const contractLabel = contractReady ? shortenAddress(config.token.contractAddress) : "Non ancora pubblicato";
  const explorerAccountUrl = account ? `${config.explorerUrl}/address/${account}` : config.explorerUrl;
  const explorerContractUrl = contractReady ? `${config.explorerUrl}/address/${config.token.contractAddress}` : null;
  const walletPrimaryAction = !account
    ? { label: busy ? "Attendi nel wallet…" : "Collega wallet di prova", action: connectWallet }
    : !networkReady
      ? { label: busy ? "Attendi nel wallet…" : "Passa a Base Sepolia", action: switchNetwork }
      : null;

  return (
    <main className="krl-beta-page" id="top">
      <div className="krl-testnet-bar" role="status">
        <b>Solo testnet</b>
        <span>Nessun valore reale, nessuna vendita, nessun rendimento o diritto economico.</span>
      </div>

      <header className="beta-header">
        <Brand assetBasePath={assetBasePath} />
        <nav aria-label="Navigazione KRL Beta">
          <a href="#stato">Stato</a>
          <a href="#wallet">Wallet</a>
          <a href="#utilita">Utilità demo</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="beta-back" href={`${assetBasePath}/`}>Ecosistema <ArrowIcon /></a>
      </header>

      <section className="beta-hero beta-shell">
        <div className="beta-grid" aria-hidden="true" />
        <div className="beta-glow" aria-hidden="true" />
        <div className="beta-hero-copy">
          <div className="beta-eyebrow"><i /> KRL Beta · Base Sepolia</div>
          <h1>Vedi KRL.<br /><em>Prova la sua utilità.</em></h1>
          <p>
            Un prototipo pubblico su rete di prova. KRL Beta non ha valore monetario,
            non è acquistabile e non è oggetto di vendita o investimento.
          </p>
          <div className="beta-actions">
            <a className="beta-button beta-button-primary" href="#wallet">Apri il pannello wallet</a>
            <a className="beta-button beta-button-secondary" href="#utilita">Prova i crediti AI demo</a>
          </div>
        </div>

        <div className="beta-token-stage" aria-label="Logo KRL Beta">
          <div className="beta-orbit beta-orbit-one" />
          <div className="beta-orbit beta-orbit-two" />
          <div className="beta-token">
            <Image src={`${assetBasePath}/kreluna-logo.png`} alt="" width={66} height={66} unoptimized />
            <b>KRL</b>
            <span>BETA</span>
          </div>
          <span className="stage-label stage-label-network">BASE SEPOLIA</span>
          <span className="stage-label stage-label-supply">100M PROGETTATI</span>
          <span className="stage-label stage-label-sale">VENDITA OFF</span>
        </div>
      </section>

      <section className="beta-status beta-shell" id="stato" aria-labelledby="status-title">
        <div className="beta-section-heading">
          <div className="beta-eyebrow"><i /> Stato della beta</div>
          <h2 id="status-title">Una prova tecnica.<br /><em>Nessuna vendita.</em></h2>
        </div>
        <div className="status-grid">
          <article><span>Rete</span><b>Base Sepolia</b><small>Chain ID 84532</small></article>
          <article><span>Fornitura progettata</span><b>100.000.000 KRL</b><small>Parametro della demo, non ancora on-chain</small></article>
          <article><span>Vendita</span><b>Non disponibile</b><small>Nessun prezzo, acquisto o raccolta attiva</small></article>
          <article><span>Contratto</span><b>{contractLabel}</b><small>{contractReady ? "Indirizzo testnet configurato" : "Deployment in preparazione"}</small></article>
        </div>
        <p className="status-footnote">
          Sono parametri della demo: non costituiscono un piano di vendita, una valutazione economica
          o una promessa di distribuzione futura.
        </p>
      </section>

      <section className="wallet-section beta-shell" id="wallet" aria-labelledby="wallet-title">
        <div className="wallet-copy">
          <div className="beta-eyebrow"><i /> Wallet di prova</div>
          <h2 id="wallet-title">Wallet di prova.<br /><em>Contratto non pubblicato.</em></h2>
          <p>
            Collega un wallet senza condividere password o parole di recupero. La pagina può preparare
            Base Sepolia; saldo e aggiunta restano disattivati finché non viene pubblicato
            un contratto Base Sepolia verificabile. Il collegamento richiede un browser con wallet integrato.
          </p>
          <div className="wallet-safety">
            <span aria-hidden="true">✓</span>
            <p><b>Kreluna non chiede mai</b> seed phrase, chiavi private o trasferimenti per collegare il wallet.</p>
          </div>
        </div>

        <div className="wallet-panel">
          <div className="wallet-panel-top" role="status" aria-live="polite">
            <span className={`wallet-dot ${account && networkReady ? "ready" : ""}`} />
            <span>{walletNotice}</span>
            <b>TESTNET</b>
          </div>
          <div className="wallet-balance">
            <span>Saldo KRL Beta</span>
            <strong>{balance ?? "—"}</strong>
            <small>{contractReady ? "Saldo letto da Base Sepolia" : "Disattivato: contratto non pubblicato"}</small>
          </div>
          <dl className="wallet-details">
            <div><dt>Wallet</dt><dd title={account ?? undefined}>{account ? shortenAddress(account) : "Non collegato"}</dd></div>
            <div><dt>Rete</dt><dd>{chainId ? (networkReady ? "Base Sepolia" : `Rete ${chainId}`) : "—"}</dd></div>
            <div>
              <dt>Contratto</dt>
              <dd>
                {explorerContractUrl
                  ? <a href={explorerContractUrl} target="_blank" rel="noreferrer">{config.token.contractAddress}</a>
                  : contractLabel}
              </dd>
            </div>
          </dl>
          <div className="wallet-actions">
            {walletPrimaryAction && (
              <button className="beta-button beta-button-primary" onClick={walletPrimaryAction.action} disabled={busy}>
                {walletPrimaryAction.label}
              </button>
            )}
            <button className="beta-button beta-button-secondary" onClick={addToken} disabled={busy || !account || !networkReady || !contractReady}>
              {contractReady ? "Aggiungi KRL al wallet" : "Token non ancora disponibile"}
            </button>
            <a className="wallet-explorer" href={explorerAccountUrl} target="_blank" rel="noreferrer">
              Apri Base Sepolia Explorer <ArrowIcon />
            </a>
          </div>
          {(configNotice || !contractReady) && (
            <p className="wallet-config-note">
              {configNotice || "L’indirizzo verificabile comparirà qui soltanto dopo la pubblicazione su Base Sepolia."}
            </p>
          )}
        </div>
      </section>

      <section className="utility-section beta-shell" id="utilita" aria-labelledby="utility-title">
        <div className="utility-heading">
          <div>
            <div className="beta-eyebrow"><i /> Simulatore locale</div>
            <h2 id="utility-title">Dai token<br /><em>all’utilità AI.</em></h2>
          </div>
          <p>
            Questa prova simula un possibile flusso Kreluna senza usare blockchain, denaro o servizi a pagamento.
            I valori restano soltanto in questa pagina e si azzerano ricaricandola.
          </p>
        </div>

        <div className="utility-flow">
          <article className="utility-card">
            <span>01 · Saldo demo</span>
            <strong>{demoKrl.toLocaleString("it-IT")} <small>KRL</small></strong>
            <p>Token dimostrativi locali, non on-chain.</p>
            <button onClick={loadDemo} disabled={demoKrl > 0}>Carica 1.000 KRL demo</button>
          </article>
          <div className="flow-arrow" aria-hidden="true">→</div>
          <article className="utility-card utility-card-action">
            <span>02 · Simula utilizzo</span>
            <strong>100 <small>KRL demo</small></strong>
            <p>Simula un pacchetto di capacità AI.</p>
            <button onClick={spendDemo} disabled={demoKrl < 100}>Usa 100 KRL demo</button>
          </article>
          <div className="flow-arrow" aria-hidden="true">→</div>
          <article className="utility-card utility-card-result">
            <span>03 · Risultato demo</span>
            <strong>{demoCredits.toLocaleString("it-IT")} <small>crediti AI</small></strong>
            <p>Crediti dimostrativi, non riscattabili.</p>
            <button onClick={resetDemo} disabled={demoKrl === 0 && demoCredits === 0}>Azzera demo</button>
          </article>
        </div>
        <p className="demo-result" aria-live="polite">{demoNotice}</p>
      </section>

      <section className="how-section beta-shell" aria-labelledby="how-title">
        <div className="beta-section-heading">
          <div className="beta-eyebrow"><i /> Come funziona la demo</div>
          <h2 id="how-title">Tre passaggi.<br /><em>Nessuna chiave condivisa.</em></h2>
        </div>
        <ol className="how-grid">
          <li><span>01</span><h3>Collega il wallet</h3><p>Autorizzi soltanto la visualizzazione del tuo indirizzo pubblico.</p></li>
          <li><span>02</span><h3>Passa alla testnet</h3><p>Il wallet prepara Base Sepolia, una rete senza denaro reale.</p></li>
          <li><span>03</span><h3>Aggiungi KRL Beta</h3><p>Se il contratto verrà pubblicato, il pulsante potrà importare simbolo, contratto e logo.</p></li>
        </ol>
      </section>

      <section className="faq-section beta-shell" id="faq" aria-labelledby="faq-title">
        <div className="beta-section-heading">
          <div className="beta-eyebrow"><i /> Risposte chiare</div>
          <h2 id="faq-title">KRL Beta,<br /><em>senza ambiguità.</em></h2>
        </div>
        <div className="faq-list">
          <details><summary>Posso acquistare KRL Beta?</summary><p>No. Non è in vendita e non può essere acquistato con euro o altre cripto-attività.</p></details>
          <details><summary>Ha un prezzo o un valore di mercato?</summary><p>No. È una configurazione dimostrativa su rete di prova, senza valore monetario.</p></details>
          <details><summary>Dove vedo il contratto?</summary><p>Non è pubblicato. Un eventuale indirizzo Base Sepolia verificabile sarà mostrato qui.</p></details>
          <details><summary>A cosa servono i crediti AI demo?</summary><p>Soltanto a simulare un possibile flusso di utilità. Non sono acquistabili, convertibili o riscattabili.</p></details>
        </div>
      </section>

      <section className="sale-off beta-shell" aria-label="Stato della vendita">
        <div>
          <span className="sale-off-icon" aria-hidden="true">×</span>
          <div><b>Acquisto non disponibile</b><p>Questa beta serve esclusivamente a provare interfaccia, wallet e utilità dimostrativa.</p></div>
          <span>SALE · OFF</span>
        </div>
      </section>

      <footer className="beta-footer beta-shell">
        <Brand assetBasePath={assetBasePath} />
        <p>KRL Beta · Base Sepolia · Nessun valore reale</p>
        <a href={`${assetBasePath}/`}>Torna a Kreluna</a>
      </footer>
    </main>
  );
}
