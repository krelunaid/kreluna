export const BASE_SEPOLIA = Object.freeze({
  chainId: 84532,
  chainIdHex: "0x14a34",
  chainName: "Base Sepolia",
  rpcUrl: "https://sepolia.base.org",
  explorerUrl: "https://sepolia-explorer.base.org",
  nativeCurrency: Object.freeze({ name: "Ethereum", symbol: "ETH", decimals: 18 }),
});

export const DEFAULT_KRL_CONFIG = Object.freeze({
  environment: "beta",
  status: "predeploy",
  chainId: BASE_SEPOLIA.chainId,
  chainName: BASE_SEPOLIA.chainName,
  rpcUrl: BASE_SEPOLIA.rpcUrl,
  explorerUrl: BASE_SEPOLIA.explorerUrl,
  token: Object.freeze({
    name: "Kreluna Token Beta",
    symbol: "KRL",
    decimals: 18,
    contractAddress: null,
    logoUrl: "https://www.kreluna.it/kreluna-logo.png",
    projectedSupply: "100000000",
    projectedTestAllocation: "10000000",
  }),
});

export function isValidAddress(value) {
  return typeof value === "string"
    && /^0x[0-9a-fA-F]{40}$/.test(value)
    && !/^0x0{40}$/i.test(value);
}

export function isHttpsUrl(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateRuntimeConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Configurazione KRL non valida.");
  }

  const token = value.token;
  if (!token || typeof token !== "object" || Array.isArray(token)) {
    throw new Error("Metadati KRL non validi.");
  }
  if (value.chainId !== BASE_SEPOLIA.chainId) {
    throw new Error("La beta può usare soltanto Base Sepolia.");
  }
  if (!isHttpsUrl(value.rpcUrl) || !isHttpsUrl(value.explorerUrl)) {
    throw new Error("RPC ed explorer devono usare HTTPS.");
  }
  if (token.symbol !== "KRL" || token.decimals !== 18) {
    throw new Error("Metadati del token non validi.");
  }
  if (token.contractAddress !== null && !isValidAddress(token.contractAddress)) {
    throw new Error("Indirizzo del contratto non valido.");
  }

  return {
    environment: "beta",
    status: token.contractAddress ? "deployed" : "predeploy",
    chainId: BASE_SEPOLIA.chainId,
    chainName: BASE_SEPOLIA.chainName,
    rpcUrl: value.rpcUrl,
    explorerUrl: value.explorerUrl.replace(/\/$/, ""),
    token: {
      name: typeof token.name === "string" ? token.name : "Kreluna Token Beta",
      symbol: "KRL",
      decimals: 18,
      contractAddress: token.contractAddress,
      logoUrl: isHttpsUrl(token.logoUrl) ? token.logoUrl : DEFAULT_KRL_CONFIG.token.logoUrl,
      projectedSupply: "100000000",
      projectedTestAllocation: "10000000",
    },
  };
}

export function providerErrorCode(error) {
  if (!error || typeof error !== "object") return null;
  const value = error.code;
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return null;
}

export function walletErrorMessage(error) {
  const code = providerErrorCode(error);
  if (code === 4001) return "Operazione annullata nel wallet.";
  if (code === -32002) return "Una richiesta è già aperta nel wallet.";
  return "Il wallet non ha completato l’operazione. Puoi riprovare.";
}

export async function ensureBaseSepolia(provider) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_SEPOLIA.chainIdHex }],
    });
  } catch (error) {
    if (providerErrorCode(error) !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: BASE_SEPOLIA.chainIdHex,
        chainName: BASE_SEPOLIA.chainName,
        nativeCurrency: BASE_SEPOLIA.nativeCurrency,
        rpcUrls: [BASE_SEPOLIA.rpcUrl],
        blockExplorerUrls: [BASE_SEPOLIA.explorerUrl],
      }],
    });
  }
}

export function normalizeChainId(value) {
  if (typeof value === "number" && Number.isSafeInteger(value)) return value;
  if (typeof value !== "string") return null;
  const parsed = Number.parseInt(value, value.startsWith("0x") ? 16 : 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function shortenAddress(address) {
  if (!isValidAddress(address)) return "—";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function encodeBalanceOf(address) {
  if (!isValidAddress(address)) throw new Error("Wallet non valido.");
  return `0x70a08231${address.slice(2).toLowerCase().padStart(64, "0")}`;
}

export function parseHexBalance(value) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]+$/.test(value)) {
    throw new Error("Risposta saldo non valida.");
  }
  return BigInt(value);
}

export function formatTokenAmount(raw, decimals = 18, maximumFractionDigits = 4) {
  const unit = 10n ** BigInt(decimals);
  const whole = raw / unit;
  const remainder = raw % unit;
  const fraction = remainder
    .toString()
    .padStart(decimals, "0")
    .slice(0, maximumFractionDigits)
    .replace(/0+$/, "");
  const groupedWhole = whole.toLocaleString("it-IT");
  return fraction ? `${groupedWhole},${fraction}` : groupedWhole;
}

export async function readTokenBalance(config, account, fetchImpl = fetch) {
  if (!isValidAddress(config.token.contractAddress) || !isValidAddress(account)) {
    throw new Error("Contratto o wallet non configurato.");
  }

  const response = await fetchImpl(config.rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{
        to: config.token.contractAddress,
        data: encodeBalanceOf(account),
      }, "latest"],
    }),
  });
  if (!response.ok) throw new Error("RPC Base Sepolia non disponibile.");
  const payload = await response.json();
  if (payload.error || typeof payload.result !== "string") {
    throw new Error("Saldo KRL non disponibile.");
  }
  return parseHexBalance(payload.result);
}
