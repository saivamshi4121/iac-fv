import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

const app = express();
// CORS: allow frontend (Vercel) to call the API and handle preflight
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

const PORT = process.env.PORT || 8080;
const TOOL_TIMEOUT_MS = 60_000;

function run(cmd, options = {}) {
  return new Promise((resolve) => {
    const child = exec(cmd, { timeout: TOOL_TIMEOUT_MS, ...options }, (error, stdout, stderr) => {
      resolve({ code: error ? (error.code ?? 1) : 0, stdout: stdout?.toString() || '', stderr: stderr?.toString() || '' });
    });
  });
}

const ANSI_REGEX = /\u001b\[[0-9;]*m/g; // strip color sequences
function stripAnsiText(text) {
  if (!text) return '';
  return text.replace(ANSI_REGEX, '');
}
function stripAnsiResult(r) {
  return r ? { ...r, stdout: stripAnsiText(r.stdout), stderr: stripAnsiText(r.stderr) } : r;
}

app.post('/api/validate', async (req, res) => {
  try {
    const { terraform } = req.body || {};
    if (typeof terraform !== 'string' || terraform.trim().length === 0) {
      return res.status(400).json({ error: 'terraform field (string) is required' });
    }

    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'iac-'));
    const workdir = path.join(tmpRoot, uuidv4());
    await fs.mkdir(workdir, { recursive: true });
    const tfFile = path.join(workdir, 'main.tf');
    await fs.writeFile(tfFile, terraform, 'utf8');

    const results = { fmt: {}, init: {}, validate: {}, tflint: {}, checkov: {} };

    results.fmt = stripAnsiResult(await run('terraform fmt -recursive -check -no-color', { cwd: workdir }));
    results.init = stripAnsiResult(await run('terraform init -backend=false -input=false -lock=false -upgrade -no-color', { cwd: workdir }));
    results.validate = stripAnsiResult(await run('terraform validate -no-color', { cwd: workdir }));

    results.tflint = stripAnsiResult(await run('tflint --init && tflint -f json', { cwd: workdir, shell: true }));
    results.checkov = stripAnsiResult(await run('checkov -d . --framework terraform -o json', { cwd: workdir }));

    // Best-effort cleanup
    try { await fs.rm(workdir, { recursive: true, force: true }); } catch {}
    try { await fs.rm(tmpRoot, { recursive: true, force: true }); } catch {}

    return res.json({ results });
  } catch (err) {
    return res.status(500).json({ error: 'internal_error', detail: String(err) });
  }
});

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.get('/api/versions', async (_req, res) => {
  const terraform = await run('terraform -version');
  const tflint = await run('tflint --version');
  const checkov = await run('checkov -v');
  return res.json({ terraform, tflint, checkov });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
});


