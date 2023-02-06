# groupie

/ˈɡruːpi/, noun (informal)

> "A fan following a band's events with the hope of meeting them."

**Description:** A node.js server for following Ethereum smart contract
events and making them available via LMDB.

## introduction

Solidity contracts are emitting events as state transition markers for
off-chain applications to stay synchronized. 

An out-of-band synchronization of a large Ethereum smart contract can be
technically challenging. Downloading block event logs can fail, event parsing
can be ambiguous and follow-up downloads can complicate the pipeline.

``@attestate/groupie`` is an embeddable process that keeps an ordered record of
specified Ethereum events in a thread-safe LMDB. Developers can spin up groupie
to synchronized to Ethereum's latest state while thread-safely reading the
entries from disk using LMDB.

## information

- [Documentation](https://attestate.com/groupie/main)
