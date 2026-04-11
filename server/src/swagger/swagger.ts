import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express, { Request, Response } from "express";
const port = process.env.PORT || 8000;
const router = express.Router()



const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Streaks App API",
            version: "1.0.0",
            description: "API documentation for the Streaks tracking application",
        },
        tags: [
            {
                name: "Auth",
                description: "Endpoints related to authentication",
            },
            {
                name: "Habits",
                description: "Endpoints related to habit management",
            },
            {
                name: "Admin",
                description: "Admin-only endpoints",
            },
            {
                name: "System",
                description: "System and health endpoints",
            }
        ],
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                CookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "jwt",
                    description: "JWT stored in httpOnly cookie named jwt"
                },
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Optional bearer token auth for clients that use Authorization header"
                }
            },
            schemas: {
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false
                        },
                        message: {
                            type: "string",
                            example: "Internal Server Error"
                        }
                    }
                },
                UserAuthInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "demo@example.com"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "StrongPass123!"
                        }
                    }
                },
                AuthUser: {
                    type: "object",
                    properties: {
                        userId: {
                            type: "string",
                            format: "uuid"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        }
                    }
                },
                HabitInput: {
                    type: "object",
                    required: ["title", "frequency", "startDate"],
                    properties: {
                        title: {
                            type: "string",
                            example: "Morning Run"
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Run for 20 minutes"
                        },
                        frequency: {
                            type: "string",
                            example: "daily"
                        },
                        startDate: {
                            type: "string",
                            format: "date-time",
                            example: "2026-03-22T00:00:00.000Z"
                        }
                    }
                },
                HabitUpdateInput: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            example: "Updated Morning Run"
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            example: "Updated notes"
                        },
                        frequency: {
                            type: "string",
                            example: "weekly"
                        }
                    }
                },
                Habit: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        title: {
                            type: "string"
                        },
                        description: {
                            type: "string",
                            nullable: true
                        },
                        frequency: {
                            type: "string"
                        },
                        startDate: {
                            type: "string",
                            format: "date-time"
                        },
                        archived: {
                            type: "boolean"
                        },
                        userId: {
                            type: "string",
                            format: "uuid"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                HabitCheckin: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        habitId: {
                            type: "string",
                            format: "uuid"
                        },
                        date: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                AdminUser: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid"
                        },
                        email: {
                            type: "string",
                            format: "email"
                        },
                        name: {
                            type: "string",
                            nullable: true
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }
    },
    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.ts", "./src/server.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
require("swagger-model-validator")(swaggerSpec);

router.get("/json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
})

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router 