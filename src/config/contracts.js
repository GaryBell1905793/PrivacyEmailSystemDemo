export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" // Replace after deployment

// PrivacyEmail Contract ABI
export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "string", "name": "subject", "type": "string" },
      { "internalType": "string", "name": "content", "type": "string" }
    ],
    "name": "sendPlainEmail",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "emailId", "type": "uint256" }
    ],
    "name": "markAsRead",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "emailId", "type": "uint256" }
    ],
    "name": "deleteEmail",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserEmails",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "emailId", "type": "uint256" },
          { "internalType": "string", "name": "subject", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint8", "name": "state", "type": "uint8" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "internalType": "struct PrivacyEmail.EmailMetadata[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getSentEmails",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "emailId", "type": "uint256" },
          { "internalType": "string", "name": "subject", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint8", "name": "state", "type": "uint8" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "internalType": "struct PrivacyEmail.EmailMetadata[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "emailId", "type": "uint256" }
    ],
    "name": "getEmailDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "emailId", "type": "uint256" },
          { "internalType": "string", "name": "subject", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "uint8", "name": "state", "type": "uint8" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" }
        ],
        "internalType": "struct PrivacyEmail.EmailMetadata",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalEmails",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
