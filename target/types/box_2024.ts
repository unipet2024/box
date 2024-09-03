export type Box2024 = {
  "version": "0.1.0",
  "name": "box_2024",
  "constants": [
    {
      "name": "ADMIN_ROLE",
      "type": "bytes",
      "value": "[65, 68, 77, 73, 78, 95, 82, 79, 76, 69]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setAuthority",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "role",
          "type": {
            "defined": "AuthRole"
          }
        },
        {
          "name": "operators",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setStatus",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "status",
          "type": {
            "defined": "BoxStatus"
          }
        }
      ]
    },
    {
      "name": "createBox",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "currencies",
          "type": {
            "vec": {
              "defined": "Currency"
            }
          }
        },
        {
          "name": "rates",
          "type": "bytes"
        },
        {
          "name": "nfts",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addMints",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "nfts",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addNftToBox",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "boxAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        }
      ]
    },
    {
      "name": "changeRates",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "rates",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "buyBoxSpl",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyBuyer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "buyBoxSol",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftBuyer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        },
        {
          "name": "id",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "authorityRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "status",
            "type": "bool"
          },
          {
            "name": "role",
            "type": {
              "defined": "AuthRole"
            }
          },
          {
            "name": "authorities",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "boxStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "counter",
            "type": "u64"
          },
          {
            "name": "starttime",
            "type": "i64"
          },
          {
            "name": "endtime",
            "type": "i64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "rates",
            "type": "bytes"
          },
          {
            "name": "currencies",
            "type": {
              "vec": {
                "defined": "Currency"
              }
            }
          },
          {
            "name": "mints",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mintsPurchased",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "unipetBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxId",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operator",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": {
              "defined": "BoxStatus"
            }
          }
        ]
      }
    },
    {
      "name": "userStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "boughts",
            "type": {
              "vec": {
                "defined": "UserClaim"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "UserClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxId",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "isClaim",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Currency",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AuthRole",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Admin"
          },
          {
            "name": "Operator"
          }
        ]
      }
    },
    {
      "name": "BoxStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Waiting"
          },
          {
            "name": "Open"
          },
          {
            "name": "Close"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "SetAuthorityEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "role",
          "type": {
            "defined": "AuthRole"
          },
          "index": false
        },
        {
          "name": "operators",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "SetStatusEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "BoxStatus"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CreationBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "name",
          "type": "string",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currencies",
          "type": {
            "vec": {
              "defined": "Currency"
            }
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNftsBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "mints",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNftBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ChangRateBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "rates",
          "type": "bytes",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CloseBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyBoxEvent",
      "fields": [
        {
          "name": "boxId",
          "type": "u8",
          "index": false
        },
        {
          "name": "id",
          "type": "u64",
          "index": false
        },
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mints",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimBoxEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "boxId",
          "type": "u8",
          "index": false
        },
        {
          "name": "id",
          "type": "u64",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityAlready",
      "msg": "Authority already"
    },
    {
      "code": 6001,
      "name": "BoxClosed",
      "msg": "Box closed"
    },
    {
      "code": 6002,
      "name": "BoxNotStartYet",
      "msg": "Box not start yet"
    },
    {
      "code": 6003,
      "name": "SoldOut",
      "msg": "Sold out"
    },
    {
      "code": 6004,
      "name": "CurrencyNotSupport",
      "msg": "Currency not support"
    },
    {
      "code": 6005,
      "name": "AccountInvalid",
      "msg": "Account invalid"
    },
    {
      "code": 6006,
      "name": "AdminAccountInvalid",
      "msg": "Admin account invalid"
    },
    {
      "code": 6007,
      "name": "OperatorAccountInvalid",
      "msg": "Operator account invalid"
    },
    {
      "code": 6008,
      "name": "OnlyAdmin",
      "msg": "Only admin"
    },
    {
      "code": 6009,
      "name": "OnlyOperator",
      "msg": "Only Operator"
    },
    {
      "code": 6010,
      "name": "OperatorNotChange",
      "msg": "Operator not change"
    },
    {
      "code": 6011,
      "name": "InputInvalid",
      "msg": "Input invalid"
    },
    {
      "code": 6012,
      "name": "RateInvalid",
      "msg": "Rate Invalid"
    },
    {
      "code": 6013,
      "name": "InsufficientAmount",
      "msg": "Insufficient amount"
    },
    {
      "code": 6014,
      "name": "OnlyOwner",
      "msg": "Only owner"
    },
    {
      "code": 6015,
      "name": "InvalidTime",
      "msg": "Invalid time"
    }
  ]
};

export const IDL: Box2024 = {
  "version": "0.1.0",
  "name": "box_2024",
  "constants": [
    {
      "name": "ADMIN_ROLE",
      "type": "bytes",
      "value": "[65, 68, 77, 73, 78, 95, 82, 79, 76, 69]"
    }
  ],
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setAuthority",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "role",
          "type": {
            "defined": "AuthRole"
          }
        },
        {
          "name": "operators",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "setStatus",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "status",
          "type": {
            "defined": "BoxStatus"
          }
        }
      ]
    },
    {
      "name": "createBox",
      "accounts": [
        {
          "name": "unipetBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "currencies",
          "type": {
            "vec": {
              "defined": "Currency"
            }
          }
        },
        {
          "name": "rates",
          "type": "bytes"
        },
        {
          "name": "nfts",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addMints",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "nfts",
          "type": {
            "vec": "publicKey"
          }
        }
      ]
    },
    {
      "name": "addNftToBox",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "boxAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        }
      ]
    },
    {
      "name": "changeRates",
      "accounts": [
        {
          "name": "operatorAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "rates",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "buyBoxSpl",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyBuyer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currencyMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "buyBoxSol",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "boxAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftBuyer",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "boxId",
          "type": "u8"
        },
        {
          "name": "id",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "authorityRole",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "status",
            "type": "bool"
          },
          {
            "name": "role",
            "type": {
              "defined": "AuthRole"
            }
          },
          {
            "name": "authorities",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "boxStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "counter",
            "type": "u64"
          },
          {
            "name": "starttime",
            "type": "i64"
          },
          {
            "name": "endtime",
            "type": "i64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "rates",
            "type": "bytes"
          },
          {
            "name": "currencies",
            "type": {
              "vec": {
                "defined": "Currency"
              }
            }
          },
          {
            "name": "mints",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "mintsPurchased",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "unipetBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxId",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "operator",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": {
              "defined": "BoxStatus"
            }
          }
        ]
      }
    },
    {
      "name": "userStruct",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "boughts",
            "type": {
              "vec": {
                "defined": "UserClaim"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "UserClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "boxId",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "isClaim",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Currency",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AuthRole",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Admin"
          },
          {
            "name": "Operator"
          }
        ]
      }
    },
    {
      "name": "BoxStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Waiting"
          },
          {
            "name": "Open"
          },
          {
            "name": "Close"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "SetAuthorityEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "role",
          "type": {
            "defined": "AuthRole"
          },
          "index": false
        },
        {
          "name": "operators",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "SetStatusEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "status",
          "type": {
            "defined": "BoxStatus"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CreationBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "name",
          "type": "string",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currencies",
          "type": {
            "vec": {
              "defined": "Currency"
            }
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNftsBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "mints",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "AddNftBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ChangRateBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "rates",
          "type": "bytes",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "CloseBoxEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "id",
          "type": "u8",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BuyBoxEvent",
      "fields": [
        {
          "name": "boxId",
          "type": "u8",
          "index": false
        },
        {
          "name": "id",
          "type": "u64",
          "index": false
        },
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mints",
          "type": {
            "vec": "publicKey"
          },
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimBoxEvent",
      "fields": [
        {
          "name": "buyer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "boxId",
          "type": "u8",
          "index": false
        },
        {
          "name": "id",
          "type": "u64",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "time",
          "type": "i64",
          "index": false
        },
        {
          "name": "slot",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AuthorityAlready",
      "msg": "Authority already"
    },
    {
      "code": 6001,
      "name": "BoxClosed",
      "msg": "Box closed"
    },
    {
      "code": 6002,
      "name": "BoxNotStartYet",
      "msg": "Box not start yet"
    },
    {
      "code": 6003,
      "name": "SoldOut",
      "msg": "Sold out"
    },
    {
      "code": 6004,
      "name": "CurrencyNotSupport",
      "msg": "Currency not support"
    },
    {
      "code": 6005,
      "name": "AccountInvalid",
      "msg": "Account invalid"
    },
    {
      "code": 6006,
      "name": "AdminAccountInvalid",
      "msg": "Admin account invalid"
    },
    {
      "code": 6007,
      "name": "OperatorAccountInvalid",
      "msg": "Operator account invalid"
    },
    {
      "code": 6008,
      "name": "OnlyAdmin",
      "msg": "Only admin"
    },
    {
      "code": 6009,
      "name": "OnlyOperator",
      "msg": "Only Operator"
    },
    {
      "code": 6010,
      "name": "OperatorNotChange",
      "msg": "Operator not change"
    },
    {
      "code": 6011,
      "name": "InputInvalid",
      "msg": "Input invalid"
    },
    {
      "code": 6012,
      "name": "RateInvalid",
      "msg": "Rate Invalid"
    },
    {
      "code": 6013,
      "name": "InsufficientAmount",
      "msg": "Insufficient amount"
    },
    {
      "code": 6014,
      "name": "OnlyOwner",
      "msg": "Only owner"
    },
    {
      "code": 6015,
      "name": "InvalidTime",
      "msg": "Invalid time"
    }
  ]
};
