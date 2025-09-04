#![cfg(test)]

extern crate std;

use crate::asset::{AssetClient, Asset};
use soroban_sdk::{contract, contractimpl, testutils::Address as _, Address, Env, String};

#[test]
fn initial_state() {
    let env = Env::default();
}
