import Select, { StylesConfig, ThemeConfig, SingleValue } from 'react-select';

type OptionType = { label1: string; label2: string; value: string, imageUrl1: string, imageUrl2: string, purshase_price: number, amount: number };


const customStyles: StylesConfig<OptionType, false> = {
    container: (base, { isDisabled, isFocused }) => ({
      ...base,
      color: 'white',
      border: "#8a8aa0",
      width: "98%"
    }),
    control: (provided, state) => ({
      ...provided,
      boxShadow: "#8a8aa0",
      border: "1px solid #8a8aa0",
      backgroundColor: "#26262f",
      color: "white",
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      color: "white",
      backgroundColor: "#26262f",
      border: "1px solid #8a8aa0",
      padding: "2px"
  
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#3a3a4f" : state.isFocused ? "#4a4a5f" : "#26262f",
      color: state.isSelected ? "white" : "white",
      borderBottom: "0.1px solid #8a8aa0",
      
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
      padding: "10px"
  
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white",
    }),
  };
  
  const customTheme: ThemeConfig = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "#26262f",
      primary: 'white',
    },
  });


  const formatOptionLabel = ({ label1, imageUrl1, label2, imageUrl2 }: OptionType) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imageUrl1} alt="" style={{ marginRight: "10px", width: "20px", height: "20px" }} />
        <span>{label1}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{label2}</span>
        <img src={imageUrl2} alt="" style={{ marginLeft: "10px", width: "20px", height: "20px" }} />
      </div>
    </div>
  );
  

export {customStyles, customTheme, formatOptionLabel}
export type {OptionType}