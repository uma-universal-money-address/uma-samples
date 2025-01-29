## MakeCents

[MakeCents](https://makecents.uma.me) is an UMA demo that showcases how businesses can use UMA Auth and micropayments to incentive user behavior.  In MakeCents, users earn a small reward for the amount of time they spend watching an ad.  They can earn additional rewards for completing a survey.

Users use UMA Auth to log in and connect their Wallet.  As they earn rewards interacting with the site, they can see their wallet balance increasing in real time.  As a user watches the video, their actions are sent to the mock backend `route.ts`.  Route then initiates payment to the user's authenticated and authorized wallet.  In a real scenario your services would validate the users actions before initiating payment.

We're excited to see what you build!

### Running the Server

To run the server for these demos, follow these steps:

1. Ensure you have Node Version Manager (nvm) installed. If not, you can install it from [nvm's official repository](https://github.com/nvm-sh/nvm).

2. Use nvm to install Node version 20 by running the following command:
   ```bash
   nvm use v20
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

4. [Register the client app for Nostr.](https://docs.uma.me/uma-auth/uma-auth-client/client-app-registration)

5. Modify your `src/utils/config.ts` file to update the `CLIENT_ID` values you received from the registration process. 

6. Create a UMA NWC url to represent the payer at [umanwc.sandbox.uma.me](https://umanwc.sandbox.uma.me).  Click the Manual connection button, create the manual connection then copy the URL.
   
7. Configure the `NWC_URL` environment variable with the copied URL. You can set this variable in your terminal session or in a `.env` file in the root of your project:
   ```bash
   export NWC_URL="your_nostr_wallet_connect_url_here"
   ```

8. Start the development server with the configured environment variable:
   ```bash
   npm run dev
   ```

9. Open your browser and navigate to `http://localhost:3000` to see the demo in action.