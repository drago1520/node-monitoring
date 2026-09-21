import { register } from 'import-in-the-middle/register-hooks.mjs'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici'
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis'
import { ConsoleInstrumentation } from '@opentelemetry/instrumentation-console'
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node'
import { HostMetricsInstrumentation } from '@opentelemetry/instrumentation-host-metrics'

register()

process.env.OTEL_SERVICE_NAME ??= 'hono'
process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??= 'http://localhost:4318'
process.env.OTEL_EXPORTER_OTLP_PROTOCOL ??= 'http/protobuf'
process.env.OTEL_LOGS_EXPORTER ??= 'otlp'

const sdk = new NodeSDK({
  instrumentations: [
    new ConsoleInstrumentation(),
    new HttpInstrumentation(),
    new UndiciInstrumentation(),
    new MySQL2Instrumentation(),
    new PgInstrumentation(),
    new IORedisInstrumentation(),
    new RuntimeNodeInstrumentation(),
    new HostMetricsInstrumentation({ metricGroups: ['process.cpu', 'process.memory'] }),
  ],
})

sdk.start()
export default sdk
