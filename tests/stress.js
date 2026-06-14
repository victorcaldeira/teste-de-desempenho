import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const url = `${BASE_URL}/checkout/crypto`;

  const payload = JSON.stringify({
    customer: {
      name: "Victor",
      email: "victor@example.com",
      document: "12345678900",
    },
    items: [
      { sku: "SKU-1", name: "Produto 1", qty: 1, price: 10.0 },
      { sku: "SKU-2", name: "Produto 2", qty: 2, price: 15.0 },
    ],
    payment: {
      method: "crypto",
      coin: "BTC",
    },
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200 or 201": (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}