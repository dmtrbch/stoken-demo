# SToken Stellar Front-End

## Deployed version url

https://dmtrbch.github.io/stoken-demo/

## Project Description

Admin Dasboard for the SToken protocol that has exported interfaces for the following functions from the SToken Vault, and get shares in return, and allows the Processor account to process deposits and fulfill withdrawals.
- `mint` - permissionless mint of underlying asset (USDC)
- `process_deposit` - Processor gated function for processing deposit - this function transfers the underlying asset from SToken Vault to Asset Manager
- `fulfill_withdrawal` - Processor gated function for fulfilling withdrawal - this function transfers the underlying asset from SToken Vault to the user that requested the withdrawal
- `withdraw_request` - fetch details for a specific withdrawal

NOTE: Process Deposit and Fulfill Withdrawal components are only displayed if the connected account is the processor. 

## Directory structure

- `components`: UI Components for interacting with the deployed smart contract.
- `contracts`: Typescript Interfaces that expose smart contract functionality.
- `layouts`: Main Page Layout
- `pages`: Entry index.astro page

## Components

- `ConnectWallet.astro` - component which is using  `stellar-wallets-kit` to add wallet connection functionality to the dapp
- `Mint.astro` - for minting underlying asset
- `ProcessDeposit.astro` - only displayed if connected address is processor one. Used to process the deposits, this means sending the underlying asset from SToken Vault custody to the Asset Manager
- `FulfillWithdrawal.astro` - only displayed if connected address is processor one. If there is a pending withdrawal calling this function will send the underlying asset from SToken Vault to the user
- `WithdrawRequest.astro` - fetching details for a withdrawal request

## Demo walkthrough

- VIDEO: https://www.loom.com/share/29da8f897b9e4609885bf39523bb373f?sid=3b9c7263-6629-403f-a660-593fef3c88e2

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

- SToken: CCXAU7WTWO4VM5WO4E7IYHXV76NHM5PLEYPXQTHL22NAOJ5PPRJPOUZJ - FYA
- Underlying Asset: CDLV5RUYLE2PI6IQLMKOGCTZ64MFQN32SFCH6UT2F23KBCQXCQXXES6C - USDC

## Identites:

- Authority: GAZA64NGTZPSIML5BDJD7DNLVCUXQAWTH7GJAYNVKQ7QGEUUZZ6NLSVT
- Manager: GCGLDPZ4HXYBKMNGGDYTQV6N3YYFGXCEZ5AJQYBTWA4KG7WBYR5A7EHT
- Processor: GBKI6GEUE5D4DKLXXXFZ53KDJ6JYWPHPRM56VJNRAZPWQY7EDQTKRYCL
- User: GDAWGUAGW75U5XE2IV6DII67TMWDDFULMQSFY3BKHKY2AHOM2N3OLSZ6