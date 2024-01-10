import React, { useState } from 'react'
import styles from './swap.module.scss';
import { AiOutlineDown } from 'react-icons/ai';
import Image from 'next/image';


const SelectToken = (props) => {
    return (
        <div className={styles["select-style"]} onClick={props.onClick}>
            <div className={styles["select-token-name-style"]}>
                <div className={styles["select-token-icon"]}>
                    <Image src={props.token_icon} alt="Token Icon" width={30} height={30} objectFit='fill'/>
                </div>
                <p>{props.token_name}</p>
            </div>
            <div className={styles["select-icon"]}>
                <AiOutlineDown size={15} color='white'/>
            </div>
        </div>
    )
}


const Input = (props) => {
    const [inputValue, setInputValue] = useState(props.input_token);
    const [isValid, setIsValid] = useState(true);
  
    const handleInputChange = (e) => {
      const value = e.target.value;
  
      // Regex pattern to match only numbers or float numbers
      const numberRegex = /^-?\d*\.?\d*$/;
  
      // Check if the input matches the regex pattern
      const isValidInput = numberRegex.test(value);
  
      if (isValidInput || value === '') {
        setInputValue(value);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    return (
        <div className={styles["input"]}>
            <input type="text"  
                value={inputValue}
                onChange={handleInputChange}
                placeholder="0.0" 
                className={styles["input-amount"]}
            />
            <SelectToken token_name={props.token_name} token_icon={props.token_icon} onClick={props.onClick}/>
        </div>
    )
}


const Tooltip = (props) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        setShowTooltip(true);
      };
    
      const handleMouseLeave = () => {
        setShowTooltip(false);
      };
    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} 
      >
        <div style={{cursor:'pointer'}}>
            <Image src={'/icon/information-icon.svg'} width={15} height={15} alt="Information icon"/>
        </div>
        {showTooltip && (
        <div className={styles["tooltip-style"]}>
            {props.text}
        </div>
        )}
      </div>
    )
}







const Swap = ({token_data,onConnectWallet,setOnChangeToken}) => {

  const [fromToken,setFromToken] = useState(token_data[0]);
  const [toToken,setToToken] = useState(token_data[1]);

  
  
  const switchToken = () => {
        setFromToken(toToken);
        setToToken(fromToken);
  }

  const handleOnChangeToken = (data) => {
    setOnChangeToken();
  }

  return (
    <div className={styles["container"]}>
        <div className={styles["header"]}>
            <h2>Swap</h2>
        </div>
        <div className={styles["body"]}>
            <div>
                <div>
                    <h3>From</h3>
                    <Input input_value={fromToken.value} token_name="SHILL" token_icon="/icon/shill-token-icon.svg" onClick={handleOnChangeToken}/>
                </div>
                <div className={styles["switch-token-style"]}>
                    <div className={styles["switch-icon"]} onClick={switchToken}>
                        <Image src="/icon/switch-icon.svg" width={30} height={30} alt="switch icon"/>
                    </div>
                    <div className={styles["switch-value-style"]}>
                        1 {fromToken.token_name} = 0.001 {toToken.token_name}
                        <div >
                            <Image src="/icon/switch-horizontal-icon.svg" width={20} height={20} alt="horizontal icon" />
                        </div>
                    </div>
                   
                </div>
                <div>
                    <h3>To</h3>
                    <Input input_value={toToken.value} token_name="solana" token_icon="/icon/solana-icon.png" onClick={handleOnChangeToken}/>
                </div>
            </div>
            <div>
                <table className={styles["table-style"]}>
                    <tbody>
                        <tr>
                            <td className={styles["table-td-style"]}
                            >
                                Minimum Received
                                <Tooltip text="The least amount of tokens you will receive on this transaction."/>
                            </td>
                            <td className={styles["value-style"]}>
                                -
                            </td>
                        </tr>
                        <tr>
                            <td className={styles["table-td-style"]}>
                                Price Impact
                                <Tooltip text="The difference between the market price and estimated price due to the transaction size."/>
                            </td>
                            <td className={styles["value-style"]}>
                                -
                            </td>
                        </tr>
                        <tr>
                            <td className={styles["table-td-style"]}>
                                Slippage Tolerance
                                <Tooltip text="The maximum difference between your estimated price and execution price."/>
                            </td>
                            <td className={styles["value-style"]}>
                                <div className={styles["slippage-tolerance-value-style"]}>
                                    1%
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles["table-td-style"]}>
                                Estimated Fee
                                <Tooltip text="The least amount of tokens you will receive on this transaction."/>
                            </td>
                            <td className={styles["value-style"]}>
                                -
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className={styles["footer"]}>
            <button className={styles["button-style"]} onClick={onConnectWallet}>
                Connect Wallet
            </button>
            <div>
                Powered by 
                <Image src={'/icon/one-inch-icon.svg'} width={30} height={30} alt="1inch.io icon"/>
                <span>
                    <a href='https://1inch.io/' target='_blank' rel="noreferrer" style={{textDecoration:'none'}}>
                        1Inch.io
                    </a>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Swap