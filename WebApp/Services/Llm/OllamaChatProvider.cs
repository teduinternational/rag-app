using RagAppBasic.Models;

namespace RagAppBasic.Services.Llm;

public class OllamaChatProvider : ILlmChatProvider
{
    private readonly HttpClient _http;
    private readonly AppConfig _cfg;

    public OllamaChatProvider(IHttpClientFactory f, AppConfig cfg)
    {
        _cfg = cfg;
        _http = f.CreateClient(nameof(OllamaChatProvider));
        _http.BaseAddress = new Uri(cfg.Ollama.BaseUrl);
    }

    public async Task<string> AskAsync(string system, string user, CancellationToken ct = default)
    {
        var body = new
        {
            model = _cfg.Ollama.ChatModel,
            messages = new object[] {
                new { role="system", content=system },
                new { role="user", content=user }
            },
            stream = false,
            options = new { temperature = 0.2 }
        };
        var resp = await _http.PostAsJsonAsync("api/chat", body, ct);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadFromJsonAsync<dynamic>(cancellationToken: ct);
        return (string)json.message.content;
    }
}

