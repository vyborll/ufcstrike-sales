export const nftScript = `
  import UFC_NFT from 0x329feb3ab062d289

  pub fun main(owner: Address, id: UInt64): &UFC_NFT.NFT? {
    return UFC_NFT.fetch(owner, id: id);
  }
`;
