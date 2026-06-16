import amqp from "amqplib";
import { ScraperEngine } from "./core/ScraperEngine.js";

async function startWorker() {
  const queue = "scoutly.scraping.queue";
  const rabbitUrl = "amqp://scoutly_user:scoutly_pass@localhost:5672";

  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    console.log(
      `[*] Worker iniciado. Aguardando mensagens na fila '${queue}'...`,
    );

    const scraperEngine = new ScraperEngine();

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const payload = JSON.parse(msg.content.toString());
          console.log(
            `\n[x] Mensagem recebida para o produto: ${payload.productId}`,
          );
          console.log(`URL alvo: ${payload.url}`);

          const price = await scraperEngine.processUrl(payload.url);

          console.log(`Preço encontrado: ${price}`);

          await fetch("http://localhost:8080/api/tracking/webhook/price", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: payload.productId,
              price: price,
            }),
          });

          console.log("[→] Preço enviado para o Spring Boot.");

          channel.ack(msg);

          console.log(
            `[v] Processamento concluído e mensagem removida da fila.`,
          );
        } catch (error) {
          console.error("Erro ao processar a mensagem:", error);
        }
      }
    });
  } catch (error) {
    console.error("Erro fatal ao conectar no RabbitMQ:", error);
  }
}

startWorker();
