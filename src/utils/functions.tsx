import { OptionType } from './types'
function RoundTwoPlaces(num: any) {
    return Math.floor(num * 100) / 100;
}


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

export {
    RoundTwoPlaces,
    formatOptionLabel
}