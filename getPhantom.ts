

declare global {
  interface Window {
    solana: any;
    provider: any;
  }
}

const getPhantom = async () =>
  new Promise(async (resolve, reject) => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const provider = window.solana
        if (provider.isPhantom) {
          resolve(provider);
        }
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(null);
    }
  });
export default getPhantom;
