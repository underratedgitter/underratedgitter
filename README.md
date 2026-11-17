<a href="https://thepatelsuraj.dev">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/hero-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/hero-light.svg">
    <img alt="Suraj Patel — DevOps, Cloud and SRE. I build the pipelines that ship code, the telemetry that says it broke, and the systems that work out why." src="assets/hero-dark.svg" width="100%">
  </picture>
</a>

**[thepatelsuraj.dev](https://thepatelsuraj.dev)** &nbsp;·&nbsp; [Résumé](https://thepatelsuraj.dev/Suraj_Patel_Resume.pdf) &nbsp;·&nbsp; [LinkedIn](https://linkedin.com/in/thepatelsuraj) &nbsp;·&nbsp; [Email](mailto:23se02cs076@gmail.com) &nbsp;·&nbsp; [LeetCode](https://leetcode.com/u/sp9023156004)

Final-year B.Tech CSE student and DevOps/SRE intern who owns **two production systems end to end**: self-managed infrastructure, CI/CD with automatic rollback, security hardening, and encrypted backup and recovery. Outside work I build the other half of the stack — the pipeline that ships the code, the telemetry that tells you it broke, and the system that works out why.

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/section-receipts-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/section-receipts-light.svg">
  <img alt="00 — What the work shows" src="assets/section-receipts-dark.svg" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/receipts-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/receipts-light.svg">
  <img alt="Two production systems; every deploy health-checked and rolled back on failure. Every automated fix is bounded, allowlisted, and needs a named human approver. Push to live in under five minutes, with zero failed requests during rollouts. Not one long-lived AWS key. 675+ automated tests gate every release. 25+ GCP labs and a 12-member team that shipped 8 applications." src="assets/receipts-dark.svg" width="100%">
</picture>

<br><br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/section-work-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/section-work-light.svg">
  <img alt="01 — Selected work" src="assets/section-work-dark.svg" width="100%">
</picture>

### [Aegis ↗](https://github.com/underratedgitter/Aegis)
<sup>`2026` &nbsp;·&nbsp; EVIDENCE-FIRST SRE INCIDENT-RESPONSE COPILOT</sup>

Watches a checkout-and-inventory service pair, correlates threshold alerts and z-score anomalies into **one root-caused incident**, investigates it against real metrics, logs and runbooks, then proposes a bounded fix that a named human must approve. Chaos injection and MTTR tracking prove the loop end to end, and it runs fully offline with no API key.

`Python` `FastAPI` `Prometheus` `Grafana` `Loki` `Promtail` `SQLite`

### [CI/CD Pipeline with Docker, Kubernetes & Helm ↗](https://github.com/underratedgitter/CI-CD-Pipeline-Automation-with-Docker-Cloud-Deployment)
<sup>`2026` &nbsp;·&nbsp; PUSH TO LIVE IN UNDER FIVE MINUTES</sup>

Every image is gated on lint, Jest coverage thresholds, npm audit, and Trivy and kubeconform scans, then deployed by digest so what runs is what was scanned. A 12-object Helm chart (HPA, PDB, NetworkPolicy, ServiceMonitor) runs it on a 3-node kind cluster, where a draining readiness probe brought rollouts to **zero failed requests**. P50/P95/P99 dashboards and 11 alert rules watch it.

`Docker` `Kubernetes` `Helm` `GitHub Actions` `Trivy` `Prometheus` `Grafana`

### [Terraform AWS ECS Platform ↗](https://github.com/underratedgitter/terraform-aws-ecs-platform)
<sup>`2026` &nbsp;·&nbsp; THE INFRASTRUCTURE UNDER THE PIPELINE</sup>

A multi-module platform: VPC across two AZs, an ECS cluster, ALB, ECR with image scanning, and CloudWatch alarms, with state in S3 and DynamoDB locking. CI plans every pull request through GitHub OIDC, so there is **not one long-lived AWS key**; hosts enforce IMDSv2 and are reached through SSM, never SSH.

`Terraform` `AWS ECS` `ALB` `VPC` `IAM` `GitHub OIDC`

### [RAG Teaching Assistant ↗](https://github.com/underratedgitter/RAG-teaching-assistant)
<sup>`2026` &nbsp;·&nbsp; LECTURE VIDEO IN, ANSWERS WITH TIMESTAMPS OUT</sup>

Ask a question about a lecture recording and get the answer *and* the moment it was said, in under a second across 1,000+ chunks. Runs fully local with faster-whisper and Ollama: int8 quantization, greedy decoding and VAD take transcription to roughly **18–27× realtime on a plain CPU**.

`faster-whisper` `Ollama` `CUDA` `vector search`

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/section-experience-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/section-experience-light.svg">
  <img alt="02 — Where I've been" src="assets/section-experience-dark.svg" width="100%">
</picture>

**Software & Solutions Architect Intern** — [D-Tech Solution Integrators](https://dtechindia.com), Bharuch &nbsp;<sup>`AUG 2026 — NOW`</sup>
- Platform owner for [dtechindia.com](https://dtechindia.com) and [bccibharuch.in](https://bccibharuch.in), the BCCI membership portal: infrastructure, delivery, security and data protection.
- Re-platformed D-Tech from Vercel serverless to a non-root, read-only Node.js container behind Nginx on a self-managed Ubuntu VPS.
- GitHub Actions CI/CD with test and CSP gates, smoke tests and digest-pinned images; health-checked rollouts **roll back automatically**.
- Nightly **AES-256 encrypted off-site backups** with a scripted restore, and a security baseline of hash-based CSP, strict sessions, rate limiting and HMAC-signed expiring links.
- Built the BCCI portal to run on Vercel or Docker, Redis or Postgres, with **675+ automated tests** gating CI across its whole membership lifecycle.

**Cloud Event Manager** — Google Developer Student Club, P.P. Savani University &nbsp;<sup>`AUG 2023 — JAN 2024`</sup>
- Ran 25+ hands-on GCP labs and mentored a 12-member team that deployed 8 applications on GCP.

**Open source** — [Bindu](https://github.com/GetBindu/Bindu) &nbsp;<sup>`FEB 2026`</sup>
- Merged Python error-handling fixes: broad exception catches replaced with specific types.

**B.Tech, Computer Science & Engineering** — P.P. Savani University, Surat &nbsp;<sup>`2023 — 2027`</sup>
- AWS Cloud Foundations (May 2026)

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/section-toolkit-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/section-toolkit-light.svg">
  <img alt="03 — The toolkit" src="assets/section-toolkit-dark.svg" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/toolkit-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/toolkit-light.svg">
  <img alt="Cloud and IaC: AWS, GCP, Vercel, Terraform. Containers and CI/CD: Docker, Kubernetes, Helm, GitHub Actions, GHCR, Trivy, kubeconform. Observability and SRE: Prometheus, Grafana, Loki, Promtail, runbooks, postmortems, MTTR, chaos testing. Security: CSP, HMAC signing, AES-256, least-privilege IAM, secrets management, image scanning. Linux and networking: Ubuntu, systemd, Nginx, Bash, TCP/IP, DNS. Languages: Python, Bash, JavaScript, SQL, C++. Data: PostgreSQL, Redis, MySQL, MongoDB." src="assets/toolkit-dark.svg" width="100%">
</picture>

<br><br>

<a href="https://thepatelsuraj.dev">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/contact-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/contact-light.svg">
    <img alt="Let's build something reliable — thepatelsuraj.dev" src="assets/contact-dark.svg" width="100%">
  </picture>
</a>

<sub>Open to DevOps, cloud and SRE roles, including onsite in Surat — <a href="mailto:23se02cs076@gmail.com">23se02cs076@gmail.com</a>. Set in Instrument Serif and Geist Mono (SIL Open Font License).</sub>
