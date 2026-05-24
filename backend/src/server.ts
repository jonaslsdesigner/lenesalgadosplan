import cors from "cors";
import express from "express";
import { z } from "zod";
import { env } from "./env.js";
import { createLocalOrder, mockData } from "./mockData.js";
import { hasSupabaseConfig, supabaseAdmin } from "./supabase.js";

const app = express();

app.use(cors({ origin: env.corsOrigins }));
app.use(express.json());

const orderWebhookSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerAddress: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().positive(),
      notes: z.string().optional()
    })
  ),
  paymentMethod: z.enum(["pix", "dinheiro", "cartao"]).optional(),
  orderType: z.enum(["delivery", "encomenda"]).default("delivery"),
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().optional()
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "lene-salgados-backend",
    dataMode: hasSupabaseConfig ? "supabase" : "local-mock",
    supabaseConfigured: hasSupabaseConfig
  });
});

app.get("/api/dashboard", (_req, res) => {
  res.json({
    monthLabel: mockData.monthLabel,
    metrics: mockData.metrics,
    weeklyPerformance: mockData.weeklyPerformance,
    lowStock: mockData.lowStock,
    activeOrders: mockData.orders.filter((order) => order.status !== "entregue")
  });
});

app.get("/api/orders", (req, res) => {
  const activeOnly = req.query.active === "true";
  const orders = activeOnly
    ? mockData.orders.filter((order) => order.status !== "entregue")
    : mockData.orders;

  res.json({ orders });
});

app.post("/webhooks/orders", async (req, res) => {
  const parsed = orderWebhookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      message: "Pedido invalido.",
      issues: parsed.error.flatten()
    });
  }

  if (!supabaseAdmin) {
    const order = createLocalOrder(parsed.data);

    return res.status(202).json({
      ok: true,
      mode: "local-mock",
      message: "Pedido salvo temporariamente nos dados locais ilustrativos.",
      order
    });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: parsed.data.customerName,
      customer_phone: parsed.data.customerPhone,
      customer_address: parsed.data.customerAddress,
      items: parsed.data.items,
      payment_method: parsed.data.paymentMethod,
      order_type: parsed.data.orderType,
      scheduled_at: parsed.data.scheduledAt,
      notes: parsed.data.notes,
      status: "novo"
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      ok: false,
      message: "Nao foi possivel salvar o pedido.",
      error: error.message
    });
  }

  return res.status(201).json({ ok: true, order: data });
});

app.listen(env.port, () => {
  console.log(`Lene Salgados API rodando em http://localhost:${env.port}`);
});
