import { lookup } from "node:dns/promises";
import { spawn } from "node:child_process";
import https from "node:https";

type CliOptions = {
  remote: string;
  branch?: string;
  host: string;
  intervalSec: number;
  timeoutMs: number;
  dryRun: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    remote: "origin",
    branch: undefined,
    host: "github.com",
    intervalSec: 15,
    timeoutMs: 5000,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--remote") {
      options.remote = argv[index + 1] ?? options.remote;
      index += 1;
      continue;
    }

    if (arg === "--branch") {
      options.branch = argv[index + 1] ?? options.branch;
      index += 1;
      continue;
    }

    if (arg === "--host") {
      options.host = argv[index + 1] ?? options.host;
      index += 1;
      continue;
    }

    if (arg === "--intervalSec") {
      options.intervalSec = Number(argv[index + 1] ?? options.intervalSec);
      index += 1;
      continue;
    }

    if (arg === "--timeoutMs") {
      options.timeoutMs = Number(argv[index + 1] ?? options.timeoutMs);
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelpAndExit();
    }
  }

  if (!Number.isFinite(options.intervalSec) || options.intervalSec <= 0) {
    throw new Error("`--intervalSec` must be a positive number.");
  }

  if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
    throw new Error("`--timeoutMs` must be a positive number.");
  }

  return options;
}

function printHelpAndExit(): never {
  console.log(`
Usage:
  pnpm exec tsx scripts/retry-git-push-on-network.ts [options]

Options:
  --remote <name>       Git remote name, default: origin
  --branch <name>       Branch to push, default: current branch
  --host <hostname>     Host used for connectivity checks, default: github.com
  --intervalSec <n>     Retry interval in seconds, default: 15
  --timeoutMs <n>       Network check timeout in ms, default: 5000
  --dry-run             Only perform one connectivity check, no git push
  --help, -h            Show this help
`);
  process.exit(0);
}

function timestamp() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function log(message: string) {
  console.log(`[${timestamp()}] ${message}`);
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function runGitCommand(args: string[], captureOutput = false) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((resolve) => {
    const child = spawn("git", args, {
      shell: false,
      stdio: captureOutput ? ["ignore", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdout += text;
      if (!captureOutput) {
        process.stdout.write(text);
      }
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderr += text;
      if (!captureOutput) {
        process.stderr.write(text);
      }
    });

    child.on("error", (error) => {
      stderr += error.message;
      resolve({ code: 1, stdout, stderr });
    });

    child.on("close", (code) => {
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

async function getCurrentBranch() {
  const result = await runGitCommand(["rev-parse", "--abbrev-ref", "HEAD"], true);
  if (result.code !== 0) {
    throw new Error(`Failed to detect current branch: ${result.stderr || result.stdout}`);
  }

  return result.stdout.trim();
}

async function checkHttps(host: string, timeoutMs: number) {
  return new Promise<void>((resolve, reject) => {
    const request = https.request(
      {
        host,
        method: "HEAD",
        path: "/",
        timeout: timeoutMs,
      },
      (response) => {
        response.resume();
        if (response.statusCode && response.statusCode >= 200 && response.statusCode < 500) {
          resolve();
          return;
        }

        reject(new Error(`Unexpected HTTPS status code: ${response.statusCode ?? "unknown"}`));
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("HTTPS check timed out"));
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.end();
  });
}

async function checkConnectivity(host: string, timeoutMs: number) {
  const dnsResult = await Promise.race([
    lookup(host),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("DNS lookup timed out")), timeoutMs);
    }),
  ]);

  await checkHttps(host, timeoutMs);
  return dnsResult;
}

function isRetryableGitPushError(output: string) {
  const normalized = output.toLowerCase();
  return [
    "could not resolve host",
    "failed to connect",
    "connection timed out",
    "connection reset",
    "network is unreachable",
    "couldn't connect to server",
    "operation timed out",
    "tls handshake timeout",
    "temporary failure in name resolution",
  ].some((token) => normalized.includes(token));
}

async function waitForConnectivity(options: CliOptions) {
  while (true) {
    try {
      await checkConnectivity(options.host, options.timeoutMs);
      log(`网络已恢复，${options.host} 可访问。`);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`网络未恢复，检测失败：${message}`);
      await delay(options.intervalSec * 1000);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const branch = options.branch ?? (await getCurrentBranch());

  log(`目标推送：git push ${options.remote} ${branch}`);
  log(`网络探测：host=${options.host}, interval=${options.intervalSec}s, timeout=${options.timeoutMs}ms`);

  if (options.dryRun) {
    await checkConnectivity(options.host, options.timeoutMs);
    log("dry-run 检测成功，未执行 git push。");
    return;
  }

  process.on("SIGINT", () => {
    log("收到中断信号，已停止自动重试。");
    process.exit(130);
  });

  let attempt = 0;
  while (true) {
    attempt += 1;
    log(`开始第 ${attempt} 次网络检查...`);
    await waitForConnectivity(options);

    log(`开始执行 git push ${options.remote} ${branch}`);
    const pushResult = await runGitCommand(["push", options.remote, branch], false);

    if (pushResult.code === 0) {
      log("推送成功。");
      return;
    }

    const combinedOutput = `${pushResult.stdout}\n${pushResult.stderr}`;
    if (!isRetryableGitPushError(combinedOutput)) {
      throw new Error(`git push failed with a non-network error.\n${combinedOutput.trim()}`);
    }

    log("git push 仍然是网络类错误，将继续等待后重试。");
    await delay(options.intervalSec * 1000);
  }
}

void main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${timestamp()}] ${message}`);
  process.exit(1);
});
