using RagAppBasic.Models;
using RagAppBasic.Services.Embedding;
using RagAppBasic.Services.Llm;
using RagAppBasic.Services.Vector;

namespace RagAppBasic.Services;

public class RagPipeline
{
    private readonly IEmbeddingProvider _emb;
    private readonly ILlmChatProvider _llm;
    private readonly IQdrantClient _vec;
    private readonly AppConfig _cfg;

    public RagPipeline(IEmbeddingProvider emb, ILlmChatProvider llm, IQdrantClient vec, AppConfig cfg)
    {
        _emb = emb; 
        _llm = llm; 
        _vec = vec; 
        _cfg = cfg;
    }

    public async Task IngestAsync(IEnumerable<(string text, string? source)> chunks, CancellationToken ct = default)
    {
        int dim = await _emb.GetDimAsync(ct);
        await _vec.EnsureCollectionAsync(dim, ct);

        var list = new List<VecPoint>();
        foreach (var (text, source) in chunks)
        {
            var vec = await _emb.EmbedAsync(text, ct);
            list.Add(new VecPoint(Guid.NewGuid().ToString("N"), vec, text, source));
        }
        await _vec.UpsertAsync(list, ct);
    }

    public async Task<QueryResponse> AskAsync(string question, int? topK, CancellationToken ct = default)
    {
        int dimension = await _emb.GetDimAsync(ct);
        await _vec.EnsureCollectionAsync(dimension, ct);

        var qvec = await _emb.EmbedAsync(question, ct);
        var hits = await _vec.SearchAsync(qvec, topK ?? _cfg.Rag.TopK, ct);
        var filteredHits = hits.Where(h => h.Score >= _cfg.Rag.MinScore).ToList();

        if (filteredHits.Count == 0)
        {
            return new QueryResponse("Cannot find any matched context data in your knowledge base.", new List<QueryHit>());
        }

        // Deduplicate by text fingerprint
        var seenHits = new HashSet<string>();
        var dedupedHits = new List<VecHit>();
        foreach (var h in filteredHits)
        {
            var fp = Fingerprint(h.Text);
            if (seenHits.Contains(fp)) continue;
            seenHits.Add(fp);
            dedupedHits.Add(h);
        }


        // Make a numbered list of context hits
        var numbered = dedupedHits.Select((h, i) => (Idx: i + 1, Hit: h)).ToList();

        // Citations like [#1] Source (score=0.987)
        var citations = string.Join("\n", numbered.Select(x => $"[#${x.Idx}] {x.Hit.Source ?? x.Hit.Id} (score={x.Hit.Score:0.000})"));

        // Context blocks with IDs
        var context = string.Join("\n---\n", numbered.Select(x => $"ID:{x.Idx}\n{x.Hit.Text}"));


        // IMPORTANT: Adjust the prompt below to fit your LLM provider's token limit.
        var system = "You must answer ONLY using the CONTEXT. If not found, reply: 'I don't know'. " +
                     "Cite context IDs in square brackets like [#1], [#2]. Be concise.";

        // User prompt with question and context
        var user = $"QUESTION:\n{question}\n\nCONTEXT (each block has ID):\n{context}";

        var answer = await _llm.AskAsync(system, user, ct);

        // Append sources to the answer
        answer += "\n\nSources:\n" + citations;

        var respHits = dedupedHits.Select(h => new QueryHit(h.Id, h.Score, h.Text, h.Source)).ToList();
        
        return new QueryResponse(answer, respHits);
    }

    static string Fingerprint(string s)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(s.Trim().ToLowerInvariant());
        return Convert.ToHexString(sha.ComputeHash(bytes)).Substring(0, 16);
    }
}
