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
        tags: [{
            name: "Streaks",
            description: "Endpoints related to streak management",
        },
        {
            name: "Users",
            description: "Endpoints related to user management",
        },
        {
            name: "Auth",
            description: "Endpoints related to authentication",
        }
        ],
        servers: [
            {
                url: `http://localhost:${port}`,
                description: "Development server",
            },
        ],
    },
    components: {
        secruitySchemes: {
            Bearer: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "JWT Key authorization for API"
            }
        },
        ApiKeyAuth: {
            type: "apikey",
            in: "header",
            name: "x-api-key",
            description: "API key authorization for API"
        }
    },

    // Paths to files containing OpenAPI definitions
    apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);
require("swagger-model-validator")(swaggerSpec);

router.get("/json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
})

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router 