# Create Your Own UI

Unlike traditional examples where devs are given a fixed UI, this example let's you pick your own variant from a variety of variants for a component.

For example, There are a few variants of [Setup Screen component file](./src/components/setup-screen.tsx).

```tsx
export default SetupScreenPreBuilt;

export default CustomSetupScreenWithPrebuiltMediaPreviewModal;

export default CustomSetupScreenWithCustomMediaPreviewModal;
```

All you have to do, to pick a variant of your choice, is to comment out the undesired variants and only uncomment the one you want. Once you have made up your mind, you can copy paste the code to your application.

## How to run?

1. Run `npm install` in the current [folder](./)
2. Run `npm run dev` to start a server. See the port in the logs of this command. Default is 5173.
3. Open browser with the URL `http://localhost:5173/?authToken=PUT_PARTICIPANT_AUTH_TOKEN_HERE`. Change the port if needed.

To learn more, refer to [the source code](./src/App.tsx)
