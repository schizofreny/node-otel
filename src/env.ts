import { DiagLogLevel } from "@opentelemetry/api"
import { config } from "dotenv"
import { z } from "zod"
import * as uuid from "uuid"

// This enables support for .env file
config()

let envSchema = z.object({
  OPENTELEMETRY_LOG_LEVEL: z.nativeEnum(DiagLogLevel).default(DiagLogLevel.NONE),

  OPENTELEMETRY_SERVICE_NAME: z.string({ description: "Logical name of the service" }),
  OPENTELEMETRY_SERVICE_NAMESPACE: z.string({ description: "A namespace for service.name" }).optional(),
  OPENTELEMETRY_SERVICE_INSTANCE_ID: z
    .string({ description: "The string ID of the service instance" })
    .optional()
    .default(uuid.v4()),
  OPENTELEMETRY_SERVICE_VERSION: z
    .string({ description: "The version string of the service API or implementation." })
    .optional(),

  JAEGER_EXPORTER_ENDPOINT: z.string({ description: "JaegerExporter endpoint" }).url(),
  JAEGER_EXPORTER_USERNAME: z.string({ description: "JaegerExporter optional username" }).optional(),
  JAEGER_EXPORTER_PASSWORD: z.string({ description: "JaegerExporter optional password" }).optional(),
})

export const env = envSchema.parse(process.env)
