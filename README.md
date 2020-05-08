![Coward](img/logo.png)

Coward is a Deno module for easy interaction with the [Discord API](https://discordapp.com/developers/docs/intro "Discord API")

## Usage

Coward is not ready for any proper usage yet.

## Example

```typescript
import Coward from 'https://denopkg.com/fox-cat/coward/mod.ts'

let client = new Coward("TOKEN_GO_HERE")

client.on("messageCreate", (message: any) => {
    if(message.content == "!ping") {
        client.createMessage(message.channel.id, "Pong!");
    }
})

client.connect()
```

## License

Please refer to [LICENSE](LICENSE)
