# Bare bone Node.js observability

This repo aims to be minimal, foundational example on how to observe Node.js in production. I used open-source Signoz & OpenTelemetry **without requiring any code changes.**

I don't believe you can get more bang for buck, i.e. functionality vs complexity. This setup is just 1 cli command to setup a complete APM, which closed-source companies would change many $$$ per/ month per seat. 

It's simple, boring and foundational for production readiness.

## Setup

Prerequisites:
- docker
- Nodejs

1. Install Signoz with docker
   1. [Install foundry](https://signoz.io/docs/install/docker/#step-1-install-foundryctl), which simplifies docker deployment. Run `curl -fsSL https://signoz.io/foundry.sh | bash`
   2. Go inside `telemetry/` and run `foundryctl cast -f casting.yaml`
   3. Done.
2. Run nodejs in `nodejs/`
3. Open all possible URL endpoints in your browser. `/` `/postgres` `/mysql` `/redis` `/error`
4. Done. Play around in Signoz UI on `localhost:8080` (by default)
5. (pro tip) Connect your AI agent via MCP. I recommend.
   1. your AI will be able to do anything as you can. Create new dashboards, inspect traces etc. One of the most broken features.
6. (optional) Add my Dashboard for production grade observability with all key metrics in one panel.
   1. Go to Signoz UI > `Dashboards` from the left side bar > `+ New dashboard` button top right > `Import from JSON` tab. Import from `telemetry/dashboards/production.json`.
   2. Feel free to contribute with your dashboards!


#### How to debug nodejs not sending anything to signoz
```ps  
$env:OTEL_LOG_LEVEL="debug"
```

#### No need for Hono logger
I already collect all data it logs.