using OpenAI.Chat;

namespace RagAppBasic.Services.Llm;

public class OpenAIChatProvider : ILlmChatProvider
{
    private readonly ChatClient _chat;

    public OpenAIChatProvider(ChatClient chat)
    {
        _chat = chat;
    }

    public async Task<string> AskAsync(string system, string user, CancellationToken ct = default)
    {
        var messages = new List<ChatMessage>
        {
            new SystemChatMessage(system),
            new UserChatMessage(user)
        };

        var completion = await _chat.CompleteChatAsync(messages, cancellationToken: ct);
        return completion.Value.Content[0].Text.ToString();
    }

}