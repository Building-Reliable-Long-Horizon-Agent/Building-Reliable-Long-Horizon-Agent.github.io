# Reliable Horizon

A research blog for the survey **Building Reliable Long-Horizon Agents:
A Survey**.

The article turns the paper's central framework into a readable web field guide:
cross-step coupling, six task-pressure axes, the model–harness–environment–protocol
stack, representative benchmarks, system design, evaluation, and open problems.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate

```bash
npm run build
npm test
```

## GitHub Pages

```bash
npm run export:pages
```

This writes the static site to `out/`. Pushes to `main` deploy that artifact
through the GitHub Pages workflow.

The site runs locally with vinext. The bundled paper, figures, tables, and fonts
are served with no third-party runtime requests. Figures are direct exports of
the source PDFs in the latest Overleaf project; Tables 1–3 are vector crops from
the latest compiled manuscript. None of the paper visuals are redrawn for the
web. The article serves pixel-identical lossless WebP copies of the PNG figures
and lazy-loads everything after Figure 1; each caption still links to the
original PNG at full resolution.
