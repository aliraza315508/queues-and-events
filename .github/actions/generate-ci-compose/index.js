const fs = require("fs");
const path = require("path");

const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
const outputFile = process.env.INPUT_OUTPUT_FILE || "docker-compose.ci.yml";
const outputPath = path.resolve(workspace, outputFile);

const projectName = "ecommerce-queues-events-ci";
const networkName = "ecommerce-ci-network";

/**
 * Scanned from parent pom.xml and each service application.properties:
 * order-service         -> 8081
 * customer-service      -> 8082
 * product-service       -> 8083
 * inventory-service     -> 8084
 * payment-service       -> 8085
 * notification-service  -> 8086
 */
const services = [
  { name: "order-service", port: 8081, kafka: true },
  { name: "customer-service", port: 8082 },
  { name: "product-service", port: 8083 },
  { name: "inventory-service", port: 8084, kafka: true },
  { name: "payment-service", port: 8085, kafka: true },
  { name: "notification-service", port: 8086, kafka: true, rabbitmq: true }
];

const kafkaEnvironment = {
  KAFKA_NODE_ID: "1",
  KAFKA_PROCESS_ROLES: "broker,controller",
  KAFKA_CONTROLLER_QUORUM_VOTERS: "1@kafka:29093",
  KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:29093",
  KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092",
  KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT",
  KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER",
  KAFKA_INTER_BROKER_LISTENER_NAME: "PLAINTEXT",
  CLUSTER_ID: "4L6g3nShT-eMCtK--X86sw",
  KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1",
  KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1",
  KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1",
  KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0",
  KAFKA_LOG_DIRS: "/tmp/kraft-combined-logs"
};

function servicePrefix(serviceName) {
  return serviceName.replace(/-service$/, "");
}

function envPrefix(serviceName) {
  return servicePrefix(serviceName).replace(/-/g, "_").toUpperCase();
}

function quote(value) {
  return JSON.stringify(String(value));
}

function envLines(environment, indent = 6) {
  return Object.entries(environment)
    .map(([key, value]) => `${" ".repeat(indent)}${key}: ${quote(value)}`)
    .join("\n");
}

function postgresBlock(service) {
  const prefix = servicePrefix(service.name);

  const dbName = `${prefix}_db`;
  const dbUser = `${prefix}_user`;
  const dbPassword = `${prefix}_password`;
  const postgresServiceName = `${prefix}-postgres`;

  return `  ${postgresServiceName}:
    image: postgres:17-alpine
    container_name: ${postgresServiceName}-ci
    environment:
      POSTGRES_DB: ${quote(dbName)}
      POSTGRES_USER: ${quote(dbUser)}
      POSTGRES_PASSWORD: ${quote(dbPassword)}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${dbUser} -d ${dbName}"]
      interval: 10s
      timeout: 5s
      retries: 10
    networks:
      - ${networkName}
`;
}

function kafkaBlock() {
  return `  kafka:
    image: apache/kafka:3.7.0
    container_name: kafka-ci
    hostname: kafka
    environment:
${envLines(kafkaEnvironment)}
    healthcheck:
      test: ["CMD-SHELL", "/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list >/dev/null 2>&1"]
      interval: 10s
      timeout: 10s
      retries: 15
    networks:
      - ${networkName}
`;
}

function rabbitmqBlock() {
  return `  rabbitmq:
    image: rabbitmq:4-management-alpine
    container_name: rabbitmq-ci
    ports:
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: "guest"
      RABBITMQ_DEFAULT_PASS: "guest"
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 10
    networks:
      - ${networkName}
`;
}

function appBlock(service) {
  const prefix = servicePrefix(service.name);
  const upperPrefix = envPrefix(service.name);

  const dbName = `${prefix}_db`;
  const dbUser = `${prefix}_user`;
  const dbPassword = `${prefix}_password`;
  const postgresServiceName = `${prefix}-postgres`;

  const environment = {
    SERVER_PORT: String(service.port),

    // These match your application.properties placeholders exactly:
    [`${upperPrefix}_DB_URL`]: `jdbc:postgresql://${postgresServiceName}:5432/${dbName}`,
    [`${upperPrefix}_DB_USERNAME`]: dbUser,
    [`${upperPrefix}_DB_PASSWORD`]: dbPassword
  };

  if (service.kafka) {
    // Your services use: spring.kafka.bootstrap-servers=${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    environment.KAFKA_BOOTSTRAP_SERVERS = "kafka:9092";
  }

  if (service.rabbitmq) {
    // Your notification-service uses these exact placeholders.
    environment.RABBITMQ_HOST = "rabbitmq";
    environment.RABBITMQ_PORT = "5672";
    environment.RABBITMQ_USERNAME = "guest";
    environment.RABBITMQ_PASSWORD = "guest";
  }

  const dependsOn = [
    `      ${postgresServiceName}:
        condition: service_healthy`
  ];

  if (service.kafka) {
    dependsOn.push(`      kafka:
        condition: service_healthy`);
  }

  if (service.rabbitmq) {
    dependsOn.push(`      rabbitmq:
        condition: service_healthy`);
  }

  return `  ${service.name}:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        SERVICE_NAME: ${service.name}
        SERVER_PORT: ${service.port}
    container_name: ${service.name}-ci
    ports:
      - "${service.port}:${service.port}"
    environment:
${envLines(environment)}
    depends_on:
${dependsOn.join("\n")}
    networks:
      - ${networkName}
`;
}

function generateCompose() {
  return [
    `name: ${projectName}`,
    "",
    "services:",
    ...services.map(postgresBlock),
    kafkaBlock(),
    rabbitmqBlock(),
    ...services.map(appBlock),
    `networks:
  ${networkName}:
    driver: bridge
`
  ].join("\n");
}

function main() {
  const composeContent = generateCompose();

  fs.writeFileSync(outputPath, composeContent, "utf8");

  console.log(`Generated ${outputFile}`);
  console.log(`Services: ${services.map((service) => service.name).join(", ")}`);
  console.log(`Output path: ${outputPath}`);
}

main();