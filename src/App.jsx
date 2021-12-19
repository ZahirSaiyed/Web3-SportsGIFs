import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/wXsCbEJPNZGSY/giphy.gif',
	'https://media.giphy.com/media/KPZd0hfIkAnbAELcLu/giphy.gif',
  'https://media.giphy.com/media/mIQnU32gDEzJ2dVHdx/giphy.gif',
  'https://media.giphy.com/media/F2TZ9lSxPxZxhxTRD6/giphy.gif',
  'https://media.giphy.com/media/B5GTBlPqoixZwYJRgQ/giphy.gif',
	'https://media.giphy.com/media/3oKIPuZUcUO0vzwPEQ/giphy.gif',
  'https://media.giphy.com/media/aAZUV69OiM6OI/giphy.gif',
  'https://media.giphy.com/media/xUA7aT4k7JLXH71zG0/giphy.gif',
  'https://media.giphy.com/media/3hAjvu5qFmg23b8zJU/giphy.gif',
  'https://media.giphy.com/media/26vUR4I76C16XbhwA/giphy.gif'
]

const App = () => {
  //State
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const connectWallet = async () => {  
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  
  //prints out gif link and adds it to the gifList if something has been inputted
  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };
 
  //occurs when user types in the input box and then sets the value of it to our inputValue property
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };
  
  //render button when not connected to wallet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );
  
  //render when connected to wallet
  const renderConnectedContainer = () => (
    <div className="connected-container">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
      <input 
        type="text" 
        placeholder="Enter your favorite sporting moment!"
        value={inputValue}
        onChange={onInputChange} 
      />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  //if we have a walletAddress go ahead and run our fetch logic
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

   return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🥇 Sports GIF Portal 🏆</p>
          <p className="sub-text">
            View your favorite sports GIFs in the metaverse ✨
          </p>
          <p
            className="sub-text">
            Special Thanks to @{TWITTER_HANDLE} 🦄
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;