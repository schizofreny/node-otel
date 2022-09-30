import { diag, DiagConsoleLogger } from "@opentelemetry/api"
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node"
import { JaegerExporter } from "@opentelemetry/exporter-jaeger"
import { registerInstrumentations } from "@opentelemetry/instrumentation"
import { Resource } from "@opentelemetry/resources"
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base"
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"
import { PrismaInstrumentation } from "@prisma/instrumentation"
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino"
import { env } from "./env"

diag.setLogger(new DiagConsoleLogger(), env.OPENTELEMETRY_LOG_LEVEL)

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: env.OPENTELEMETRY_SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: env.OPENTELEMETRY_SERVICE_NAMESPACE,
    [SemanticResourceAttributes.SERVICE_VERSION]: env.OPENTELEMETRY_SERVICE_VERSION,
    [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: env.OPENTELEMETRY_SERVICE_INSTANCE_ID,
  }),
})

// Configure how spans are processed and exported. In this case we're sending spans
// as we receive them to an OTLP-compatible collector (e.g. Jaeger).
provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      endpoint: env.JAEGER_EXPORTER_ENDPOINT,
      password: env.JAEGER_EXPORTER_PASSWORD,
      username: env.JAEGER_EXPORTER_USERNAME,
    })
  )
)

// Register your auto-instrumentors
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    getNodeAutoInstrumentations({}),
    new PrismaInstrumentation(),
    new PinoInstrumentation({
      logHook: (span, record) => {
        record["resource.service.name"] = provider.resource.attributes["service.name"]
      },
    }),
  ],
})

// Register the provider globally
provider.register()
