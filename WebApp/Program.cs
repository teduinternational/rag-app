using Microsoft.AspNetCore.Http.Features;
using Microsoft.OpenApi.Models;
using OpenAI.Chat;
using OpenAI.Embeddings;
using RagAppBasic.Models;
using RagAppBasic.Services;
using RagAppBasic.Services.Embedding;
using RagAppBasic.Services.Llm;
using RagAppBasic.Services.Tools;
using RagAppBasic.Services.Vector;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>(optional: true);
}

// Load config (appsettings + env)
var configuration = builder.Configuration.Get<AppConfig>() ?? new AppConfig();

builder.Services.AddSingleton(configuration);
builder.Services.AddHttpClient();

builder.Services.Configure<FormOptions>(o =>
{
    o.MultipartBodyLengthLimit = 1024L * 1024L * 200L; // 200MB
});
builder.Services.AddSingleton<SearchDocsTool>();  // tool service

// Embedding provider
if (configuration.Provider.Equals("OpenAI", StringComparison.OrdinalIgnoreCase))
{
    builder.Services.AddSingleton(new EmbeddingClient(configuration.OpenAI.EmbedModel, configuration.OpenAI.ApiKey));
    builder.Services.AddSingleton(new ChatClient(configuration.OpenAI.ChatModel, configuration.OpenAI.ApiKey));
    builder.Services.AddSingleton<IEmbeddingProvider, OpenAIEmbeddingProvider>();
    builder.Services.AddSingleton<ILlmChatProvider, OpenAIChatProvider>();
}
else
{
    builder.Services.AddSingleton<IEmbeddingProvider, OllamaEmbeddingProvider>();
    builder.Services.AddSingleton<ILlmChatProvider, OllamaChatProvider>();
}

builder.Services.AddSingleton<IQdrantClient, QdrantHttpClient>();
builder.Services.AddSingleton<RagPipeline>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "RAG Basic API", Version = "v1" }));

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
