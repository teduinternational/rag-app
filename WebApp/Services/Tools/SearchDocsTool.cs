﻿using RagAppBasic.Models;
using RagAppBasic.Services.Embedding;
using RagAppBasic.Services.Vector;
using System.Text;
using System.Text.Json;

namespace RagAppBasic.Services.Tools;

public class SearchDocsTool
{
    private readonly IEmbeddingProvider _emb;
    private readonly IQdrantClient _vec;
    private readonly AppConfig _cfg;

    public SearchDocsTool(IEmbeddingProvider emb, IQdrantClient vec, AppConfig cfg)
    {
        _emb = emb; 
        _vec = vec; 
        _cfg = cfg;
    }

    public async Task<string> InvokeAsync(string query, int? topK, float? minScore, CancellationToken ct = default)
    {
        int dim = await _emb.GetDimAsync(ct);
        await _vec.EnsureCollectionAsync(dim, ct);

        int k = topK ?? _cfg.Rag.TopK;
        int overfetch = Math.Max(2, k * 3);

        var qvec = await _emb.EmbedAsync(query, ct);
        var raw = await _vec.SearchAsync(qvec, overfetch, ct);

        float gate = minScore ?? (_cfg.Rag is { } ? _cfg.Rag is { } ? _cfg.Rag.MinScore : 0.0f : 0.0f);
        var passed = raw.Where(h => h.Score >= gate).ToList();

        // Dedupe theo hash nội dung chuẩn hóa
        string Fingerprint(string s)
        {
            using var sha = System.Security.Cryptography.SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(s.Trim().ToLowerInvariant());
            return Convert.ToHexString(sha.ComputeHash(bytes)).Substring(0, 16);
        }

        var kept = new List<VecHit>();
        var seen = new HashSet<string>();
        foreach (var h in passed.OrderByDescending(x => x.Score))
        {
            if (seen.Add(Fingerprint(h.Text))) kept.Add(h);
            if (kept.Count >= k) break;
        }

        // Trả JSON gọn cho model (snippet rút gọn)
        static string Snip(string s, int max = 500)
        {
            var t = s.Replace("\r", " ").Replace("\n", " ").Trim();
            return t.Length <= max ? t : t[..max] + "…";
        }

        var payload = new
        {
            hits = kept.Select((h, i) => new {
                id = h.Id,
                ordinal = i + 1,     // để model trích dẫn [#ordinal]
                score = Math.Round(h.Score, 4),
                source = h.Source ?? "(unknown)",
                snippet = Snip(h.Text, 500)
            }).ToArray()
        };

        return JsonSerializer.Serialize(payload);
    }
}