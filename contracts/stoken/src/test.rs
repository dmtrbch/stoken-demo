#![cfg(test)]

extern crate std;

use soroban_sdk::{contract, contractimpl, testutils::Address as _, Address, Env, String};
use stellar_macros::default_impl;
use stellar_tokens::fungible::{Base, FungibleToken};

use crate::stoken::{SToken, STokenClient};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn __constructor(e: &Env, owner: Address, initial_supply: i128) {
        Base::set_metadata(
            e,
            18,
            String::from_str(e, "AssetToken"),
            String::from_str(e, "ATK"),
        );
        Base::mint(e, &owner, initial_supply);
    }

    pub fn mint(e: &Env, to: Address, amount: i128) {
        Base::mint(e, &to, amount);
    }
}

#[default_impl]
#[contractimpl]
impl FungibleToken for TokenContract {
    type ContractType = Base;
}

fn create_token_contract<'a>(e: &Env, owner: &Address) -> TokenContractClient<'a> {
    let address = e.register(
        TokenContract,
        (owner, 1_000_000_000_000_000_000_000_000i128),
    );
    TokenContractClient::new(e, &address)
}

#[test]
fn initial_state() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin);

    let contract_addr = env.register(
        SToken,
        (admin, pauser, upgrader, token_client.address.clone()),
    );
    let client = STokenClient::new(&env, &contract_addr);

    assert_eq!(client.name(), String::from_str(&env, "SToken"));
    assert_eq!(client.symbol(), String::from_str(&env, "STK"));
    assert_eq!(client.decimals(), 18);
    assert_eq!(client.total_supply(), 0);
    assert_eq!(client.query_asset(), token_client.address);
}

#[test]
fn test_deposit_basic() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    // Test deposit
    let shares_received = client.deposit(&deposit_amount, &admin.clone(), &admin.clone());

    assert!(shares_received > 0);
    assert_eq!(client.balance(&admin), shares_received);
    assert_eq!(client.total_supply(), shares_received);
}

#[test]
#[should_panic(expected = "Error(Contract, #116)")]
fn test_deposit_zero_amount() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    // Test deposit
    client.deposit(&0, &admin.clone(), &admin.clone());
}

#[test]
fn test_deposit_to_different_receiver() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);
    let receiver = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;

    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    // Test deposit
    client.deposit(&deposit_amount, &admin.clone(), &receiver.clone());

    assert_eq!(client.balance(&receiver), deposit_amount);
    assert_eq!(client.balance(&admin), 0);
    assert_eq!(client.total_supply(), deposit_amount);
}

#[test]
fn test_withdraw_basic() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    // Test deposit
    let shares_received = client.deposit(&deposit_amount, &admin.clone(), &admin.clone());

    assert!(shares_received > 0);
    assert_eq!(client.balance(&admin), shares_received);
    assert_eq!(client.total_supply(), shares_received);

    let withdraw_amount = 500_000_000_000_000_000_000;
    let shares_burned = client.withdraw(
        &withdraw_amount,
        &admin.clone(),
        &admin.clone(),
        &admin.clone(),
    );

    assert!(shares_burned > 0);
    assert!(shares_burned <= shares_received);
    assert_eq!(client.balance(&admin), shares_received - shares_burned);
    assert_eq!(client.total_supply(), shares_received - shares_burned);
}

#[test]
#[should_panic(expected = "Error(Contract, #116)")]
fn test_withdraw_zero_amount() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    // Test deposit
    let shares_received = client.deposit(&deposit_amount, &admin.clone(), &admin.clone());

    assert!(shares_received > 0);
    assert_eq!(client.balance(&admin), shares_received);
    assert_eq!(client.total_supply(), shares_received);

    let withdraw_amount = 0;
    client.withdraw(
        &withdraw_amount,
        &admin.clone(),
        &admin.clone(),
        &admin.clone(),
    );
}

#[test]
fn test_mint_basic() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    let mint_shares = deposit_amount;
    let assets_required = client.preview_mint(&mint_shares);

    let assets_received = client.mint(&mint_shares, &admin.clone(), &admin.clone());

    assert_eq!(assets_received, assets_required);
    assert_eq!(client.balance(&admin), mint_shares);
    assert_eq!(client.total_supply(), mint_shares);
}

#[test]
fn test_redeem_basic() {
    let env = Env::default();

    let admin = Address::generate(&env);
    let pauser = Address::generate(&env);
    let upgrader = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin.clone());

    let contract_addr = env.register(
        SToken,
        (
            admin.clone(),
            pauser,
            upgrader,
            token_client.address.clone(),
        ),
    );
    let client = STokenClient::new(&env, &contract_addr);

    let deposit_amount = 1_000_000_000_000_000_000_000;
    env.mock_all_auths();
    token_client.approve(
        &admin.clone(),
        &client.address.clone(),
        &deposit_amount,
        &1000,
    );

    let mint_shares = deposit_amount;
    let assets_required = client.preview_mint(&mint_shares);

    let assets_received = client.mint(&mint_shares, &admin.clone(), &admin.clone());

    assert_eq!(assets_received, assets_required);
    assert_eq!(client.balance(&admin), mint_shares);
    assert_eq!(client.total_supply(), mint_shares);

    let redeem_shares = 500_000_000_000_000_000_000;
    let assets_received = client.redeem(
        &redeem_shares,
        &admin.clone(),
        &admin.clone(),
        &admin.clone(),
    );

    assert!(assets_received > 0);
    assert_eq!(client.balance(&admin), mint_shares - redeem_shares);
    assert_eq!(client.total_supply(), mint_shares - redeem_shares);
}
