console.log("Sending data:", data);

const response = await fetch(
  "https://roshinirao.app.n8n.cloud/webhook-test/healthcare-triage",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }
);

console.log("Webhook status:", response.status);

const responseText = await response.text();
console.log("Webhook response:", responseText);