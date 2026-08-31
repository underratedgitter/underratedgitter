<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/banner-light.svg">
  <img alt="Suraj Patel — cloud and devops, AI systems, observability" src="assets/banner-dark.svg" width="100%">
</picture>

**Software & Solutions Architect** at [D-Tech Solution Integrators](https://d-tech-live-database.odoo.com), Bharuch — I build custom software for manufacturing plants, where a system going down means a production line stopping.

That shapes what I build outside work too: the pipeline that ships the code, the telemetry that tells you it broke, and the system that works out why.

**[LinkedIn](https://www.linkedin.com/in/suraj-patel-619480309/)** · **[sp9023156004@gmail.com](mailto:sp9023156004@gmail.com)** · Bharuch, Gujarat

---

## Selected work

### [terraform-aws-ecs-platform](https://github.com/underratedgitter/terraform-aws-ecs-platform) · the infrastructure under the pipeline
Terraform for a containerised service on AWS: VPC across two AZs, an ECS cluster on EC2 with a capacity provider, ALB, ECR with a lifecycle policy, scoped IAM, CloudWatch alarms. State in S3 with DynamoDB locking; CI validates and plans on every pull request through GitHub OIDC, with no long-lived AWS key anywhere.

Written for the free tier and honest about the trade that makes it fit: no NAT gateway by default, so hosts sit in public subnets whose only ingress rule sources from the load balancer's security group. One flag moves them private. The execution role is hand-written and scoped to a single repository ARN rather than using the managed policy, which grants ECR read across the whole account.

`Terraform` · `AWS` · `ECS` · `IAM` · OIDC

### [Aegis](https://github.com/underratedgitter/Aegis) · an evidence-first AI SRE copilot
Watches a checkout-and-inventory service, spots abnormal behaviour, correlates related signals into a single incident, investigates it against real telemetry and runbooks, then proposes a **bounded** remediation — never an unreviewed one.

Runs fully offline: local fallback mode completes the whole detect → investigate → approve workflow deterministically, with no API key. Setting `OPENAI_API_KEY` swaps in a tool-calling investigator on top.

`Python` · observability · incident response · LLM tool-use

### [CI/CD Pipeline Automation](https://github.com/underratedgitter/CI-CD-Pipeline-Automation-with-Docker-Cloud-Deployment) · push to cloud in under five minutes
A containerised Node/Express API on a multi-stage Alpine image — non-root user, layer caching tuned for rebuild speed. Four-stage GitHub Actions pipeline: lint and test → security audit → build, scan and push → deploy. A pull request runs the gates and stops there.

Prometheus scraping with Grafana dashboards and alert rules that fire on the things that actually page you — latency, error rate, heap growth, event-loop lag, and traffic falling off a cliff. Trivy scans every image before it ships, and the image is deployed by digest rather than by tag, so what runs is what was scanned.

A Helm chart runs the same service on Kubernetes — HPA, disruption budget, network policy, ServiceMonitor, and a `helm test` that fails the release if the endpoints are wrong. `make -C deploy up` brings up a three-node kind cluster and installs it. Moving there is what exposed the readiness probe returning 200 while the pod drained, and the `up == 0` alert that could never fire on a total outage.

`Docker` · `Kubernetes` · `Helm` · `GitHub Actions` · `Prometheus` · `Grafana`

### [RAG Teaching Assistant](https://github.com/underratedgitter/RAG-teaching-assistant) · lecture video in, answers with timestamps out
Drop in a lecture recording, ask a question, get the answer *and* the exact moment it was said. Transcription feeds a vector index; queries return in under a second across 1,000+ chunks.

Batch chunking and parallel processing on CUDA took a run from **five minutes on CPU to twenty seconds on GPU**.

`PyTorch` · `CUDA` · vector search · speech-to-text

### [DevOps Lab](https://github.com/underratedgitter/devops-lab) · working notes, honest about their edges
Sixteen guides with real depth — Linux commands and permissions, TCP/IP, Kubernetes concepts, Terraform state, Dockerfile practices, observability — five of them written out of the pipeline and Aegis below, so the examples are code that runs.

The README says plainly which directories are still stubs. A knowledge base that promises thirty topics and delivers sixteen wastes your time on the other fourteen.

`Python` · `Bash` · `Prometheus` · `Docker`

---

## Toolkit

|  |  |
|---|---|
| **Cloud & DevOps** | Docker · Kubernetes · Helm · Terraform · GitHub Actions · Prometheus · Grafana · AWS · GCP · Oracle Cloud · Linux |
| **Languages** | Python · JavaScript · Node.js · C++ · C |
| **AI & acceleration** | PyTorch · CUDA · scikit-learn · pandas · NumPy |
| **Enterprise & data** | Odoo · MySQL · MongoDB · Redis |
| **Tooling** | Git · Postman · Jest |

---

## Experience

**Software & Solutions Architect — [D-Tech Solution Integrators](https://d-tech-live-database.odoo.com), Bharuch** · current
Custom software for manufacturing plants across the Bharuch–Ankleshwar industrial belt. Systems that have to hold up on a shop floor, where downtime is counted in lost production rather than error rates.

**Cloud Event Manager — GDSC, P.P. Savani University** · Aug 2023 – Jan 2024
Ran 25+ hands-on cloud labs and 40+ coding sessions on GCP. Mentored a team of 12 through building and deploying eight applications. The programme helped the university reach **#1 in South Gujarat**.

**Data Analytics Simulation — Accenture North America** · Oct 2023
Cleaned and modelled seven datasets to shape social-media campaign strategy for a client brief.

**Open source — [Bindu](https://github.com/GetBindu/Bindu)** · 2026
Merged a refactor replacing broad exception catches with specific types across the codebase, and a documentation fix. Bindu is the identity, communication and payments layer for AI agents — 9.3k stars, 440 forks.

---

## Education & certifications

**B.Tech, Computer Science & Engineering** — P.P. Savani University, 2023–2027

AWS Cloud Foundations · IBM Machine Learning for Data Science · NPTEL Analytical Tools & Affective Computing · Saylor Business Intelligence & Analytics

---

<sub>Best reached by <a href="mailto:sp9023156004@gmail.com">email</a>.</sub>
