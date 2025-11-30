import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },   // carga baixa por 30s
    { duration: "10s", target: 300 },  // salto para 300 em 10s
    { duration: "1m", target: 300 },   // mantém 300 por 1 min
    { duration: "10s", target: 10 },   // queda imediata para 10
    { duration: "30s", target: 10 },   // mantém 10 um pouco (recuperação)
    { duration: "10s", target: 0 },    // encerra
  ],
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const url = `${BASE_URL}/checkout/simple`;

  const payload = JSON.stringify({
    customer: { name: "Victor", email: "victor@example.com", document: "12345678900" },
    items: [{ sku: "SKU-1", name: "Produto 1", qty: 1, price: 10.0 }],
    payment: { method: "card", installments: 1 },
  });

  const params = { headers: { "Content-Type": "application/json" } };

  const res = http.post(url, payload, params);

  check(res, { "status is 200 or 201": (r) => r.status === 200 || r.status === 201 });

  sleep(1);
}
