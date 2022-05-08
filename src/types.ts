export interface BlockEvent {
	blockId: string;
	blockTimestamp: string;
	type: string;
	transactionId: string;
	transactionIndex: number;
	eventIndex: number;
	data: {
		listingResourceID: number;
		storefrontResourceID: number;
		purchased: boolean;
		nftType: string;
		nftID: number;
	};
}

export interface Transaction {
	status: number;
	statusString: string;
	statusCode: number;
	errorMessage: string;
	events: TransactionEvent[];
}

export interface TransactionEvent {
	type: string;
	transactionId: string;
	transactionIndex: number;
	eventIndex: number;
	data: any;
}

export interface NFT {
	uuid: number;
	id: number;
	setId: number;
	editionNum: number;
}

export interface SetMetaData {
	creator_name: string;
	ipfs_image_hash: string;
	image_file_type: string;
	image: string;
	external_url: string;
	name: string;
	sha256_image_hash: string;
	additional_images: string;
	preview: string;
	description: string;
}
