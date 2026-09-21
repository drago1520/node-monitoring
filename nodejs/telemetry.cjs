const { NodeSDK } = require('@opentelemetry/sdk-node')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { RuntimeNodeInstrumentation } = require('@opentelemetry/instrumentation-runtime-node')
const { HostMetricsInstrumentation } = require('@opentelemetry/instrumentation-host-metrics')

process.env.OTEL_SERVICE_NAME ??= 'hono'
process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??= 'http://localhost:4318'
process.env.OTEL_EXPORTER_OTLP_PROTOCOL ??= 'http/protobuf'
process.env.OTEL_LOGS_EXPORTER ??= 'none'

const sdk = new NodeSDK({
  instrumentations: [
    new HttpInstrumentation(),
    new RuntimeNodeInstrumentation(),
    new HostMetricsInstrumentation({ metricGroups: ['process.cpu', 'process.memory'] }),
  ],
})

sdk.start()
module.exports = sdk
