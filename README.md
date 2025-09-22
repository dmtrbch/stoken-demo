# SToken Stellar Front-End

## Deployed version url

https://dmtrbch.github.io/stoken-demo/

## Project Description

Decentralized Application that allows the user to deposit/withdraw funds to/from the SToken Vault, and get shares in return, and allows the Processor account to process deposits and fulfill withdrawals.

NOTE: Process Deposit and Fulfill Withdrawal components are only displayed if the connected account is the processor. 

## Directory structure

- `components`: UI Components for interacting with the deployed smart contract.
- `contracts`: Typescript Interfaces that expose smart contract functionality.
- `layouts`: Main Page Layout
- `pages`: Entry index.astro page

## Components

- `ConnectWallet.astro` - component which is using  `stellar-wallets-kit` to add wallet connection functionality to the dapp
- `Mint.astro` - for minting underlying asset
- `Deposit.astro` for depositing underlying asset into the SToken vault
- `ProcessDeposit.astro` - only displayed if connected address is processor one. Used to process the deposits, this means sending the underlying asset from SToken Vault custody to the Asset Manager
- `Withdraw.astro` - for requesting a withdraw
- `FulfillWithdrawal.astro` - only displayed if connected address is processor one. If there is a pending withdrawal calling this function will send the underlying asset from SToken Vault to the user
- `WithdrawRequest.astro` - fetching details for a withdrawal request

## Demo walkthrough

- VIDEO: https://www.loom.com/share/17cd1cfb7a6f4a419e60278f677b759d?sid=8c6cada4-21d5-40a9-86da-073e681b6493

1. User logs in, mints 200 tokens (underlying asset).
2. User deposits 200 tokens into SToken vault, gets 39,6 shares (price per share is 5, and we account for a deposit fee)
3. Processor logs in, calling Process Deposit to process 50 tokens, and those tokens are transferred from SToken Vault to Asset Manager
4. User logs in, to request a withdrawal of 10 shares - new withdrawal request is generated with ID = 2 (this is incremental)
5. Processor logs in, gets withdrawal request details
6. Processor fulfills the withdrawal
7. User logs in, we can see that his AST balance is increased (we also account for withdrawal fee)

## Local Development

1. Install the Javascript dependencies:

```bash
npm install
```

2. When new contracts are deployed (asset and/or stoken) we need to update these addresses in `.stellar/contract-ids/`, and generate NPM packages for the contracts:

```bash
stellar contract bindings typescript \
  --network testnet \
  --contract-id asset \
  --output-dir packages/asset

cd packages/asset
npm install
npm run build
cd ..
cd ..
```
*This should be done for every contract we want to generate packages for. Sometimes the exported types and interfaces in `packages/(some_contract)/src/index.ts` might have linting errors in them so we need to manually fix them.

3. We need to make sure that `initialize.js` has all of the environment variables it needs before we do anything else.

```bash
cp .env.example .env
```

4. Then run `initialize.js`:

```bash
npm run init
```

5. Start the dev server:

```bash
npm run dev
```

## Smart Contract Addresses

- SToken: CB7U3MEFKRFGVWBRBYQI5LGBR4Q542AUGKEK5ABXUVLCQXSZ5FLEKGGE
- Underlying Asset: CAGMY5JSG6CSJMLBBVQKQZYYO3PNW2YZUGBJ34OUYT2S75XERR7FVXTR

## Identites:

- Authority: GAZA64NGTZPSIML5BDJD7DNLVCUXQAWTH7GJAYNVKQ7QGEUUZZ6NLSVT
- Manager: GCGLDPZ4HXYBKMNGGDYTQV6N3YYFGXCEZ5AJQYBTWA4KG7WBYR5A7EHT
- Processor: GBKI6GEUE5D4DKLXXXFZ53KDJ6JYWPHPRM56VJNRAZPWQY7EDQTKRYCL
- User: GDAWGUAGW75U5XE2IV6DII67TMWDDFULMQSFY3BKHKY2AHOM2N3OLSZ6