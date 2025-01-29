## Pennywall

Pennywall is a sample that illustrates the concept of a micro-transaction enabled paywall. It allows users to pay for individual viewports or paragraphs of an article automatically pulling payment from the user's authorized UMA account. 

Users can easily check their balance and see the amount they've spent to incrementally unlock content.

### Running the Server

To run the server for these sample, follow these steps:

1. Ensure you have Node Version Manager (nvm) installed. If not, you can install it from [nvm's official repository](https://github.com/nvm-sh/nvm).

2. Use Node.js version 20 by running the following command:
   ```bash
   nvm use v20
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

1. [Register the client app for Nostr.](https://docs.uma.me/uma-auth/uma-auth-client/client-app-registration)

2. Start the development server with the configured environment variable:
   ```bash
   npm run dev
   ```
3. In your browser, navigate to `http://localhost:3000` to view the sample.  You'll first need to create an UMA at [sandbox.uma.me](https://sandbox.uma.me) before using UMA Auth.