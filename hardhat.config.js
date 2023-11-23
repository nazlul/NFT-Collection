require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */


require("@nomiclabs/hardhat-ethers");
 
//const { API_URL, PRIVATE_KEY } = process.env;
 
module.exports = {
   solidity: "0.8.17",
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {},
      mumbai: {
         url: process.env.API_URL_KEY,
         accounts: [`${process.env.PRIVATE_KEY}`]
      }
   },
}

