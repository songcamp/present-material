export const newEdition = 
    `query {
        erc721Drops(
            orderBy: createdAt
            orderDirection: desc
            where: {address: "0xf86b87e5c68aa23bcd6bacf1374f3d6970f0780b"}
        ) {
            name
            owner
            symbol
            salesConfig {
            publicSalePrice
            publicSaleStart
            publicSaleEnd
            maxSalePurchasePerAddress
            }
            address
            maxSupply
            totalMinted
            editionMetadata {
            imageURI
            animationURI
            contractURI
            description
            }
            creator
        }     
    }`


    //https://api.thegraph.com/subgraphs/name/iainnash/zora-editions-mainnet/graphql?query=%7B%0A++erc721Drops%28%0A++++orderBy%3A+createdAt%0A++++orderDirection%3A+desc%0A++++where%3A+%7Baddress%3A+%220xf86b87e5c68aa23bcd6bacf1374f3d6970f0780b%22%7D%0A++%29+%7B%0A++++name%0A++++owner%0A++++symbol%0A++++salesConfig+%7B%0A++++++publicSalePrice%0A++++++publicSaleStart%0A++++++publicSaleEnd%0A++++++maxSalePurchasePerAddress%0A++++%7D%0A++++address%0A++++maxSupply%0A++++totalMinted%0A++++editionMetadata+%7B%0A++++++imageURI%0A++++++animationURI%0A++++++contractURI%0A++++++description%0A++++%7D%0A++++creator%0A++%7D%0A%7D