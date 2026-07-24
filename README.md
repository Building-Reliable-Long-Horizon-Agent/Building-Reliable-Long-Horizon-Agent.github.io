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

The site is built with vinext for deployment through OpenAI Sites. The bundled
paper, fonts, and evidence figure are served locally with no third-party runtime
requests.
