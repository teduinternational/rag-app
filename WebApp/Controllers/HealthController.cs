using Microsoft.AspNetCore.Mvc;
using RagAppBasic.Models;

namespace RagAppBasic.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    private readonly AppConfig _cfg;
    public HealthController(AppConfig cfg) => _cfg = cfg;

    [HttpGet("keys")]
    public IActionResult Keys()
    {
        bool usingOpenAI = _cfg.Provider.Equals("OpenAI", StringComparison.OrdinalIgnoreCase);
        bool hasOpenAIKey = !string.IsNullOrWhiteSpace(_cfg.OpenAI.ApiKey);

        return Ok(new
        {
            Provider = _cfg.Provider,
            UsingOpenAI = usingOpenAI,
            HasApiKey = usingOpenAI ? hasOpenAIKey : true,
            Hint = usingOpenAI && !hasOpenAIKey
                ? "Set OPENAI_API_KEY via User Secrets / ENV / Docker."
                : "OK"
        });
    }
}