import React, { ChangeEvent } from 'react';
import styles from './search.module.scss';
import { AiOutlineSearch } from 'react-icons/ai';


interface Props {
  value:any;
  onChange?: (value: string) => void;
}


const SearchInput = ({value,onChange}: Props) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={styles["search-input"]}>
      <AiOutlineSearch className="search-icon" color='white' size={25}/>
      <input 
        type="text" 
        placeholder="Search" 
        value={value}
        className={styles["search-field"]}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default SearchInput;