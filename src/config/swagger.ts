import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CampusFix API",
      version: "1.0.0",
      description:
        "Campus problem reporting and resolution platform. Students submit complaints; staff resolve them; managers view analytics.",
      contact: {
        name: "CampusFix Team",
        email: "dev@campusfix.edu",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
    tags: [
      { name: "Health", description: "System health checks" },
      { name: "Complaints", description: "Complaint management" },
      { name: "Categories", description: "Complaint categories" },
      { name: "Tags", description: "Complaint tags" },
      { name: "Reports", description: "Analytics & aggregations" },
    ],
    components: {
      securitySchemes: {
        // Placeholder for future JWT auth
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Reusable shapes referenced in route annotations
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
          },
        },
        Complaint: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Wi-Fi not working" },
            description: { type: "string" },
            location: { type: "string", example: "Lab 204" },
            building: { type: "string", nullable: true },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
            },
            status: {
              type: "string",
              enum: [
                "open",
                "assigned",
                "in_progress",
                "resolved",
                "rejected",
                "closed",
              ],
            },
            createdAt: { type: "string", format: "date-time" },
            resolvedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
      },
    },
  },
  // Where to look for JSDoc annotations
  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);