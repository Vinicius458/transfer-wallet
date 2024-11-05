import { Channel, Connection, connect } from "amqplib";
import env from "@/main/config/env";

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function createRabbitMQChannel(): Promise<Channel> {
  if (channel) {
    return channel;
  }

  if (!connection) {
    connection = await connect(env.rabbitUrl);
  }

  channel = await connection.createChannel();
  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
      channel = null;
    }
    if (connection) {
      await connection.close();
      connection = null;
    }
  } catch (error) {
    console.error("Failed to close RabbitMQ connection or channel:", error);
  }
}
