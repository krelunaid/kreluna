import assert from "node:assert/strict";
import test from "node:test";
import {
  BASE_SEPOLIA,
  DEFAULT_KRL_CONFIG,
  encodeBalanceOf,
  ensureBaseSepolia,
  formatTokenAmount,
  normalizeChainId,
  parseHexBalance,
  providerErrorCode,
  readTokenBalance,
  validateRuntimeConfig,
} from "../app/krl/wallet.js";

const ACCOUNT = "0x1111111111111111111111111111111111111111";
const TOKEN = "0x2222222222222222222222222222222222222222";

test("KRL runtime config is Base Sepolia-only and fails closed", () => {
  const config = validateRuntimeConfig(DEFAULT_KRL_CONFIG);
  assert.equal(config.chainId, 84532);
  assert.equal(config.status, "predeploy");
  assert.equal(config.token.contractAddress, null);

  assert.throws(
    () => validateRuntimeConfig({ ...DEFAULT_KRL_CONFIG, chainId: 8453 }),
    /Base Sepolia/,
  );
  assert.throws(
    () => validateRuntimeConfig({ ...DEFAULT_KRL_CONFIG, rpcUrl: "http://unsafe.example" }),
    /HTTPS/,
  );
  assert.throws(
    () => validateRuntimeConfig({
      ...DEFAULT_KRL_CONFIG,
      token: { ...DEFAULT_KRL_CONFIG.token, contractAddress: "0x0000000000000000000000000000000000000000" },
    }),
    /contratto/,
  );
});

test("normalizes Base Sepolia chain identifiers", () => {
  assert.equal(normalizeChainId("0x14a34"), BASE_SEPOLIA.chainId);
  assert.equal(normalizeChainId("84532"), BASE_SEPOLIA.chainId);
  assert.equal(normalizeChainId({}), null);
});

test("switches to Base Sepolia without adding an existing chain", async () => {
  const calls = [];
  const provider = { request: async (call) => { calls.push(call); return null; } };
  await ensureBaseSepolia(provider);
  assert.deepEqual(calls, [{
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x14a34" }],
  }]);
});

test("adds Base Sepolia only when the wallet reports an unknown chain", async () => {
  const calls = [];
  const provider = {
    request: async (call) => {
      calls.push(call);
      if (call.method === "wallet_switchEthereumChain") {
        throw { code: "4902" };
      }
      return null;
    },
  };
  await ensureBaseSepolia(provider);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].method, "wallet_addEthereumChain");
  assert.equal(calls[1].params[0].chainId, "0x14a34");
  assert.deepEqual(calls[1].params[0].rpcUrls, ["https://sepolia.base.org"]);
});

test("does not swallow a rejected wallet request", async () => {
  const provider = { request: async () => { throw { code: 4001 }; } };
  await assert.rejects(() => ensureBaseSepolia(provider));
  assert.equal(providerErrorCode({ code: "4001" }), 4001);
});

test("encodes and formats an ERC-20 balance safely", () => {
  assert.equal(
    encodeBalanceOf(ACCOUNT),
    `0x70a08231${"1".repeat(40).padStart(64, "0")}`,
  );
  assert.equal(parseHexBalance("0x16345785d8a0000"), 100000000000000000n);
  assert.equal(formatTokenAmount(1500000000000000000n), "1,5");
});

test("reads balanceOf through the configured Base Sepolia RPC", async () => {
  const config = validateRuntimeConfig({
    ...DEFAULT_KRL_CONFIG,
    token: { ...DEFAULT_KRL_CONFIG.token, contractAddress: TOKEN },
  });
  let requestBody;
  const fetchMock = async (url, options) => {
    assert.equal(url, "https://sepolia.base.org");
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ jsonrpc: "2.0", id: 1, result: "0xde0b6b3a7640000" }),
    };
  };

  const result = await readTokenBalance(config, ACCOUNT, fetchMock);
  assert.equal(result, 1000000000000000000n);
  assert.equal(requestBody.method, "eth_call");
  assert.equal(requestBody.params[0].to, TOKEN);
  assert.equal(requestBody.params[1], "latest");
});
