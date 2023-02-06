@attestate/groupie
==================

A follower to keep track of Solidity events and making them available in `LMDB
<http://www.lmdb.tech/doc/>`_.

Context
-------

Solidity contracts are emitting events as state transition markers for
off-chain applications to stay synchronized. 

An out-of-band synchronization of a large Ethereum smart contract can be
technically challenging. Downloading block event logs can fail, event parsing
can be ambiguous and follow-up downloads can complicate the pipeline.

``@attestate/groupie`` is an embeddable process that keeps an ordered record of
specified Ethereum events in a thread-safe LMDB. Developers can spin up groupie
to synchronized to Ethereum's latest state while thread-safely reading the
entries from disk using LMDB.

Installation
------------

Install via NPM:

.. code-block:: bash

  npm i @attestate/groupie

Usage
-----

There are two options for running the process. One is using ``function
loop(config)`` which will result in taking-over the entire process (blocking).
An alternative is ``function launch(config)`` which will spin up a node.js
worker thread to keep the main thread unclogged. Both functions may be used
interchangably.

.. code-block:: javascript

  import { env } from "process";

  import { loop, /* launch */ } from "@attestate/groupie";

  const config = {
    database: {
      // NOTE: Environment variable set by @attestate/crawler
      path: `${env.DATA_DIR}/events/`,
      index: {
        prefix: "events",
      },
    },
    blocks: {
      start: 14566826,
      stepSize: 10000, // default: 1
      interval: 5000,
    },
    contract: {
      address: "0x0bC2A24ce568DAd89691116d5B34DEB6C203F342",
    },
    topics: [
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    crawler: {
      queue: {
        options: {
          // NOTE: Environment variable set by @attestate/crawler
          concurrent: parseInt(env.EXTRACTION_WORKER_CONCURRENCY, 10),
        },
      },
    },
  };
  
  (async () => {
    /* 
     * Alternatively, you can use `await launch(config)` to spawn a 
     * worker_thread instead of having `loop(config)` take over the entire 
     * process.
     *
     */
    await loop(config); 
  });

There are two files needing configuration. ``@attestate/groupie`` needs a valid
``@attestate/crawler`` environment variables file and it also needs to
configuration that is passed to ``function loop`` or ``function launch``.

Environment Variables 
_____________________

A ``.env`` file must be present in accordance to what is outlined in
``attestate/crawler``'s `documentation
<https://attestate.com/crawler/main/configuration.html#environment-variables>`_.

Configuration
_____________

In addition to the Environment variables file, a JSON configuration must be
passed to the start function of groupie. Its schema specification can be found
in the `code base
<https://github.com/attestate/groupie/tree/main/src/schemata/configuration.mjs>`_.
