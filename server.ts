import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for AI Surgical Log Analysis & Remediation
  app.post("/api/diagnose-log", async (req, res) => {
    try {
      const { logEntry, deviceHostname, companyName } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          analysis: "Análise IA indisponível: Chave GEMINI_API_KEY não configurada no servidor.",
          remediationSteps: [
            "Verifique o código de erro no Event Viewer do Windows do servidor.",
            "Certifique-se de que o serviço VSS (Volume Shadow Copy) está em execução.",
            "Confira se as credenciais do cofre do HypeGuard possuem permissão de gravação no destino."
          ],
          severityLevel: "MEDIO"
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Você é um Especialista Sênior em Segurança Cibernética, SysAdmin Windows Server e Arquiteto de RMM Anti-Ransomware (HypeGuard_Backup Enterprise).
Analise o seguinte log cirúrgico de erro de backup/agente Windows Worker Service:

Empresa Cliente: ${companyName || 'Cliente Enterprise'}
Servidor/Dispositivo: ${deviceHostname || 'Servidor Principal'}
Log de Erro OS / VSS / Cofre:
${JSON.stringify(logEntry, null, 2)}

Forneça um diagnóstico técnico cirúrgico em português do Brasil com:
1. Resumo da Causa Raiz do Erro (Ex: VSS Provider Veto, falta de espaço em disco no volume E:, lock de credencial do NAS, etc).
2. Impacto para a Segurança Anti-Ransomware (Os dados estão em risco? A cópia de segurança está comprometida?).
3. 3 Passos acionáveis e imediatos para o Administrador de TI resolver no servidor do cliente.

Responda em formato JSON válido com a seguinte estrutura:
{
  "diagnosisSummary": "string",
  "ransomwareRiskImpact": "string",
  "remediationSteps": ["passo 1", "passo 2", "passo 3"],
  "recommendedActionCode": "RESTART_VSS_SERVICE | FREE_UP_SPACE | REGENERATE_VAULT_CREDENTIALS | CHECK_NETWORK"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } else {
        throw new Error("Resposta vazia da IA");
      }
    } catch (err: any) {
      console.error("Erro na análise Gemini:", err);
      return res.status(500).json({
        error: "Falha ao gerar diagnóstico com IA",
        details: err?.message || "Erro desconhecido"
      });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "HypeGuard_Backup Enterprise RMM SaaS" });
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HypeGuard Enterprise] Servidor RMM rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
