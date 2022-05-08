export const setMetaDataScript = `
  import UFC_NFT from 0x329feb3ab062d289

  pub fun main(setId: UInt32): {String: String}? {
    return UFC_NFT.getSetMetadata(setId: setId);
  }
`;
