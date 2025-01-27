## MakeCents

MakeCents is a video player demo that showcases the integration of UMA (Universal Money Address) to incentivize viewers by paying them for watching advertisements. This demo highlights how users can earn money by engaging with video content, providing a unique and rewarding ad experience.


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

4. Configure the `NWC_URL` environment variable with a Nostr Wallet Connect URL. This URL should be capable of handling small payouts to users. You can set this variable in your terminal session or in a `.env` file in the root of your project:
   ```bash
   export NWC_URL="your_nostr_wallet_connect_url_here"
   ```

5. Start the development server with the configured environment variable:
   ```bash
   npm run dev
   ```

   Ensure that the `NWC_URL` is correctly set before running this command, as it is required for the server to function properly.

By following these instructions, you will be able to run the MakeCents and Pennywall demos locally.