// @format
const configuration = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    database: {
      type: "object",
      properties: {
        path: {
          $comment:
            "A unix file system path towards a directory that'll host the database's storage",
          type: "string",
        },
        index: {
          type: "object",
          properties: {
            prefix: {
              $comment:
                "Within LMDB groupie generates an index. This string prefixes all key values",
              type: "string",
            },
          },
          required: ["prefix"],
        },
      },
      required: ["path", "index"],
    },
    blocks: {
      type: "object",
      properties: {
        start: {
          $comment:
            "The first block from which groupie starts indexing from until the network's current block height",
          minimum: 0,
          type: "integer",
        },
        stepSize: {
          $comment:
            "Stepsize is the distance between `fromBlock` and `toBlock` in eth_getLogs",
          exclusiveMinimum: 1,
          type: "integer",
        },
        interval: {
          $comment:
            "Interval defines idle gap between re-scheduling an out-of-band synchronization with Ethereum's mainnet upon catching up.",
          exclusiveMinimum: 1,
          type: "integer",
        },
      },
      required: ["start", "stepSize", "interval"],
    },
    contract: {
      type: "object",
      properties: {
        address: {
          $comment: "The contract address we want to filter event logs by.",
          pattern: "0x[a-fA-F0-9]{40}",
          type: "string",
        },
      },
      required: ["address"],
    },
    topics: {
      $comment:
        "An array of EVM topics as outlined in eth_getLogs JSON-RPC call",
      type: "array",
      items: {
        pattern: "0x[a-fA-F0-9]{64}",
        type: "string",
      },
    },
    crawler: {
      type: "object",
      properties: {
        queue: {
          type: "object",
          properties: {
            options: {
              type: "object",
              properties: {
                concurrent: {
                  type: "integer",
                },
              },
              required: ["concurrent"],
            },
          },
          required: ["options"],
        },
      },
      required: ["queue"],
    },
  },
  required: ["database", "blocks", "contract", "topics", "crawler"],
};

export default configuration;
