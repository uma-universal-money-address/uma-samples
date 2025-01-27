## Pennywall

Pennywall is a demo that illustrates the concept of micro-transactions for content consumption. It allows users to pay for individual viewports or paragraphs of an article using UMA, enabling a flexible and user-friendly approach to accessing premium content. This demo demonstrates the potential of UMA in creating a seamless and efficient pay-per-view model for digital articles and other web content.

### Running the Server

To run the server for these demos, follow these steps:

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

2. Configure the `NWC_URL` environment variable with a Nostr Wallet Connect URL. This URL should be capable of handling small payouts to users. You can set this variable in your terminal session or in a `.env` file in the root of your project:
   ```bash
   export NWC_URL="your_nostr_wallet_connect_url_here"
   ```

3. Start the development server with the configured environment variable:
   ```bash
   npm run dev
   ```

   Ensure that the `NWC_URL` is correctly set before running this command, as it is required for the server to function properly.

By following these instructions, you will be able to run the MakeCents and Pennywall demos locally.