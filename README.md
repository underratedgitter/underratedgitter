## Hi, I'm Suraj 👋

I'm a final-year CSE student in Gujarat, and I spend most of my time on the boring-but-important side of software: getting code to production safely, knowing when it breaks, and figuring out why.

Right now I'm an intern at [D-Tech Solution Integrators](https://dtechindia.com) in Bharuch, where I look after two live systems end to end — [dtechindia.com](https://dtechindia.com) and [bccibharuch.in](https://bccibharuch.in), the BCCI Bharuch membership portal. That means the servers, the deploy pipeline, security and backups.

### What I've been building

- **[Aegis](https://github.com/underratedgitter/Aegis)** — an incident-response helper for SREs. It groups noisy alerts into one incident, digs through metrics, logs and runbooks, and suggests a fix — but a human has to approve it before anything runs. Works offline, no API key needed.
- **[CI/CD pipeline](https://github.com/underratedgitter/CI-CD-Pipeline-Automation-with-Docker-Cloud-Deployment)** — Docker + Kubernetes + Helm, with tests and security scans gating every image. Took a while to get rollouts down to zero failed requests, but it got there.
- **[Terraform ECS platform](https://github.com/underratedgitter/terraform-aws-ecs-platform)** — the AWS infrastructure under that pipeline. CI authenticates through OIDC, so there are no long-lived AWS keys lying around.
- **[RAG teaching assistant](https://github.com/underratedgitter/RAG-teaching-assistant)** — ask a question about a lecture video and it tells you the answer *and* the timestamp. Runs fully local on a CPU.

### At work

- Moved D-Tech's site off Vercel onto a Docker container behind Nginx on a VPS I manage.
- Set up GitHub Actions so deploys are health-checked and roll back on their own if something fails.
- Nightly encrypted off-site backups, with a restore script I've actually tested.
- The BCCI portal has 675+ tests that have to pass before anything ships.

### Before that

- Cloud Event Manager at GDSC, P.P. Savani University — ran 25+ GCP labs and helped a 12-person team ship 8 apps.
- Small open-source contribution to [Bindu](https://github.com/GetBindu/Bindu) (Python error handling).

### Things I use a lot

AWS · GCP · Terraform · Docker · Kubernetes · Helm · GitHub Actions · Prometheus · Grafana · Loki · Nginx · Linux · Python · Bash · PostgreSQL · Redis

### Say hi

I'm looking for DevOps / cloud / SRE roles (happy to work onsite in Surat).

[thepatelsuraj.dev](https://thepatelsuraj.dev) · [LinkedIn](https://linkedin.com/in/thepatelsuraj) · [Résumé](https://thepatelsuraj.dev/Suraj_Patel_Resume.pdf) · [23se02cs076@gmail.com](mailto:23se02cs076@gmail.com)
