import Fastify from "fastify";
import view from "@fastify/view";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { getData } from "./api.js";

// Définition du __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// Configuration du moteur de template Handlebars
fastify.register(view, {
    engine: {
        handlebars: handlebars
    },
    root: path.join(__dirname, "templates"),
    layout: "layout"
});

// Route principale qui affiche la liste des personnages
fastify.get("/", async (request, reply) => {
    const characters = await getData();
    return reply.view("/index.hbs", { characters });
});

// Démarrage du serveur
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Serveur démarré sur http://localhost:3000");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
