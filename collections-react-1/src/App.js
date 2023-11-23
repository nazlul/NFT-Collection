import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x709c5ddd6e44a2028f166177f48a432344d81fc3";

function App() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  // Check if the current network is the correct network
  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        setIsCorrectNetwork(chainId === "0x13881"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on("chainChanged", (newChainId) => {
      setIsCorrectNetwork(newChainId === "0x13881"); // Change to the correct chain ID
    },[]);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error("An error occurred while disconnecting the wallet:", error);
      }
    }
  }

const data = [
    {
      url: "./assets/image/1.png",
      param: "handleMint('https://aquamarine-fantastic-ocelot-24.mypinata.cloud/ipfs/Qmd8y2eVboJVnFSSChZLs1o8pPokyXsRoZnHiwudt1qrhh/1.avif')",
    },
    {
      url: "./assets/image/2.png",
      param: "handleMint('https://aquamarine-fantastic-ocelot-24.mypinata.cloud/ipfs/Qmd8y2eVboJVnFSSChZLs1o8pPokyXsRoZnHiwudt1qrhh/2.avif')",
    },
    {
      url: "./assets/image/3.png",
      param: "handleMint('https://aquamarine-fantastic-ocelot-24.mypinata.cloud/ipfs/Qmd8y2eVboJVnFSSChZLs1o8pPokyXsRoZnHiwudt1qrhh/3.avif')",
    },
    {
      url: "./assets/image/4.png",
      param: "handleMint('https://aquamarine-fantastic-ocelot-24.mypinata.cloud/ipfs/Qmd8y2eVboJVnFSSChZLs1o8pPokyXsRoZnHiwudt1qrhh/4.avif')",
    },
    {
      url: "./assets/image/5.png",
      param: "handleMint('https://aquamarine-fantastic-ocelot-24.mypinata.cloud/ipfs/Qmd8y2eVboJVnFSSChZLs1o8pPokyXsRoZnHiwudt1qrhh/5.avif')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }

  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h1>DegenWorld</h1>
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
      return (
        <>
          <div className="connect-container">
            <br />
            <h1>DegenWorld</h1>
            <h2>NFT Marketplace</h2>
            <p>Buy an NFT from our marketplace.</p>

            {isWalletInstalled ? (
              <button className="connect-button" onClick={connectWallet}>Connect Wallet</button>
            ) : (
              <p>Install Metamask wallet</p>
            )}
          </div>
        </>
    );
  
}

  return (
    <div className="bg">
    <>
      <div className="container">
        <br />

        <h1>NFT Marketplace</h1>
        <p>An NFT Marketplace to view and mint your NFT</p>
        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt="images"
              width={250}
              height={250}
              border={2}
            />
            <button className="mint_btn"
              isLoading={isMinting}
              onClick={() => {
                handleMint(item.param);
              }}
            >
              Mint - 0.01 MATIC
            </button>
          </div>
        ))}
        <div className="withdraw_container">
        <button className="withdraw_btn"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
        </div>
        <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
      </div>
    </>
    
    </div>
    
  );
}

export default App;
