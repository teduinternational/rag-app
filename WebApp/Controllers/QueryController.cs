using Microsoft.AspNetCore.Mvc;
using RagAppBasic.Models;
using RagAppBasic.Services;

namespace RagAppBasic.Controllers;

[ApiController]
[Route("query")]
public class QueryController : ControllerBase
{
    private readonly RagPipeline _rag;

    public QueryController(RagPipeline rag) => _rag = rag;

    [HttpPost]
    public async Task<ActionResult<QueryResponse>> Ask([FromBody] QueryRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Question))
            return BadRequest("Question is required.");

        var res = await _rag.AskAsync(req.Question, req.TopK, ct);
        return Ok(res);
    }
}