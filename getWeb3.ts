import Web3 from "web3";
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

async function getWeb3Modal() {
  const provider = new WalletConnectProvider({chainId: 56,
    rpc: {
      56: 'https://bsc-dataseed.binance.org/'
    }
  });

  const providerOptions = {
    walletconnect: {
      package: provider, // required
      options: {
        infuraId: "4a2b2f588c424e8c939bec2046a4d5c4",
      },
    },
  }
  const web3modal = new Web3Modal({
    cacheProvider: true,
    providerOptions, // required
  })
  return web3modal;
}

const getWeb3Provider = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const web3modal = await getWeb3Modal();
      const provider = await web3modal.connect();
      console.log('provider', provider)
      resolve(provider);
      
    } catch (error) {
      reject(null);
    }
  });
export default getWeb3Provider;
