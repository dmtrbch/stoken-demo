use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol};
use stellar_macros::default_impl;
use stellar_tokens::fungible::{Base, FungibleToken};

const INIT: Symbol = symbol_short!("INIT");

#[contract]
pub struct Asset;

#[contractimpl]
impl Asset {
    pub fn initialize(e: &Env) {
        let init: bool = e.storage().instance().get(&INIT).unwrap_or(false);
        if init {
            panic!("Vault already initialized");
        }

        Base::set_metadata(
            e,
            7, // Precission in Stellar is 10_000_000, so 10^7
            String::from_str(e, "Asset"),
            String::from_str(e, "AST"),
        );

        e.storage().instance().set(&INIT, &true);
        e.storage().instance().extend_ttl(501120, 518400);
    }

    pub fn mint(e: &Env, account: Address, amount: i128) {
        Base::mint(e, &account, amount);
    }
}

#[default_impl]
#[contractimpl]
impl FungibleToken for Asset {
    type ContractType = Base;
}
