# RAG ASP.NET Basic

This guide covers project structure, environment setup, running Qdrant (Docker), starting the Web App, setting OpenAI secrets, ingesting sample data, and testing with the provided question list.

---

## 📁 Project Structure

```
repo-root/
├─ WebApp/
│  ├─ RagAppBasic.csproj
│  ├─ Program.cs
│  ├─ appsettings.json
│  ├─ Controllers/
│  │   ├─ IngestController.cs      # POST /ingest/upload
│  │   ├─ QueryController.cs       # POST /query
│  │   └─ HealthController.cs      # GET  /health/keys
│  ├─ Models/                     # DTOs & config
│  ├─ Services/
│  │   ├─ Embedding/              # OpenAIEmbeddingProvider / OllamaEmbeddingProvider
│  │   ├─ Llm/                    # OpenAIChatProvider / OllamaChatProvider
│  │   ├─ Vector/                 # Qdrant REST client
│  │   └─ Text/                   # PdfTextExtractor, TextChunker
│  └─ (optional) Tools/           # simple function-calling tools (demo)
├─ SampleData/
│  ├─ ... (13 files)
└─ rag_question_list_1-13.txt
```

---

## 🛠️ Environment & Docker (Qdrant)

**Requirements:**
- .NET 8 SDK
- Docker Desktop (or Podman)
- OpenAI API key (or use Ollama for local LLM)

**Run Qdrant with Docker**

**Option A — Quick Docker Run:**
```sh
docker run -d --name qdrant \
  -p 6333:6333 -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant:latest
```

**Option B — docker-compose.yml (recommended):**
```yaml
services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
volumes:
  qdrant_storage:
```

**Run:**
```sh
docker compose up -d
```

**Verify dashboard:** [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

---

## 🚀 Run the Web App

From the repository root:
```sh
dotnet restore
dotnet build
dotnet run --project ./WebApp/RagAppBasic.csproj --urls http://localhost:5000
```

Open Swagger UI:
[https://localhost:7249/swagger](http://localhost:5154/swagger)

> If you omit `--urls`, .NET may choose a random port—check the console logs.

---

## 🔑 Set your OpenAI Secret

**A) .NET User Secrets (recommended for local dev):**
```sh
cd WebApp
dotnet user-secrets init
dotnet user-secrets set "Provider" "OpenAI"
dotnet user-secrets set "OpenAI:ApiKey" "sk-...your_key..."
# Optional model overrides:
dotnet user-secrets set "OpenAI:EmbedModel" "text-embedding-3-small"
dotnet user-secrets set "OpenAI:ChatModel"  "gpt-4o-mini"
```

**B) Environment Variables:**

macOS/Linux:
```sh
export PROVIDER=OpenAI
export OPENAI_API_KEY="sk-...your_key..."
export OPENAI_EMBED_MODEL="text-embedding-3-small"
export OPENAI_CHAT_MODEL="gpt-4o-mini"
```

Windows PowerShell:
```powershell
$env:PROVIDER="OpenAI"
$env:OPENAI_API_KEY="sk-...your_key..."
$env:OPENAI_EMBED_MODEL="text-embedding-3-small"
$env:OPENAI_CHAT_MODEL="gpt-4o-mini"
```

**Alternative: Ollama (no key required)**
```sh
export PROVIDER=Ollama
export OLLAMA_BASE_URL="http://localhost:11434"
# ollama pull nomic-embed-text && ollama pull llama3
```

**Health check:**
Open `GET /health/keys` in Swagger → ensure `HasApiKey = true` (when Provider = OpenAI).

---

## 📥 Ingest SampleData

**Via Swagger:**
1. Open `POST /ingest/upload`
2. Select multiple files from `SampleData/`
3. Click Execute
4. You should see: `{ "Ingested": <number_of_chunks>, "Files": 13 }`

**Via cURL:**
```sh
curl -X POST http://localhost:7249/ingest/upload \
  -F "files=@SampleData/1. returns_policy.txt" \
  -F "files=@SampleData/2. returns_policy_variation.txt" \
  -F "files=@SampleData/3. shipping_policy.txt" \
  -F "files=@SampleData/4. shipping_policy_vi.txt" \
  -F "files=@SampleData/5. warranty_policy.txt" \
  -F "files=@SampleData/6. product_coffee_maker_faq.md" \
  -F "files=@SampleData/7. product_headphones_faq.md" \
  -F "files=@SampleData/8. hr_pto_and_holidays.txt" \
  -F "files=@SampleData/9. hr_remote_work_policy.md" \
  -F "files=@SampleData/10. tech_glossary_search.txt" \
  -F "files=@SampleData/11. troubleshooting_wifi_router.md" \
  -F "files=@SampleData/12. onboarding_checklist.md" \
  -F "files=@SampleData/13. security_best_practices.txt"
```

> The app auto-detects embedding dimension and creates a Qdrant collection like `docs_basic_1536` to avoid “dimension mismatch” when switching embedding models.

---

## ❓ Test with Question List

Open `rag_question_list_1-13.txt` and try the questions via Swagger or cURL.

**Swagger:**
POST `/query` with:
```json
{ "question": "How long do I have to return an item?", "topK": 5 }
```

**cURL:**
```sh
curl -X POST https://localhost:7249/query \
  -H "Content-Type: application/json" \
  -d '{ "question":"When will I receive my refund after a return?","topK":5 }'
```

**More examples:**
- What time do orders need to be placed to ship the same day?
- Do you offer expedited shipping to P.O. Boxes?
- How long is the warranty coverage?
- What is the battery life of H7 with ANC on?
- How often should I descale the Coffee Maker X100?
- Giao hàng tiêu chuẩn trong bao lâu?

---

## ⚙️ Quick Tuning (Optional)

You can tweak these via environment variables:
```sh
export CHUNK_SIZE=800
export CHUNK_OVERLAP=120
export TOP_K=5
# (if implemented) export MIN_SCORE=0.25     # cosine similarity threshold
```

- `CHUNK_SIZE` ~800–1200 works well for prose.
- `CHUNK_OVERLAP` ~10–20% of `CHUNK_SIZE`.
- `TOP_K`: 3–5 for simple Q&A, 5–8 for broader/multi-hop questions.

---

## 🧑‍💻 Troubleshooting

- Qdrant not reachable → check Docker (`docker ps`), and ports 6333/6334.
- 401/403 from OpenAI → verify `OPENAI_API_KEY`.
- Hallucination / off-topic → increase strictness in system prompt, raise `MIN_SCORE`, reduce `TOP_K`.
- Duplicate contexts → enable dedupe (hash normalized text).
- Switch providers (OpenAI ↔ Ollama) → app should pick a collection name that includes the embedding dimension to stay compatible.