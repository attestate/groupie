// @format
const configuration = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    database: {
      type: "object",
      properties: {
        path: {
          type: "string",
        },
        index: {
          type: "object",
          properties: {
            prefix: {
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
          minimum: 0,
          type: "integer",
        },
        stepSize: {
          exclusiveMinimum: 1,
          type: "integer",
        },
        interval: {
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
          pattern: "0x[a-fA-F0-9]{40}",
          type: "string",
        },
      },
      required: ["address"],
    },
    topics: {
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
