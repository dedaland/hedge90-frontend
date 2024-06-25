
import { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import './../index.css';

const InvoiceModal = ({ isOpen, amount, tnxId, action, onClose }: { isOpen: boolean, amount: Number, tnxId: string, action: string; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const saveAsImage = () => {
    if (modalRef.current) {
      htmlToImage.toPng(modalRef.current, {
    })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'invoice-image.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error capturing modal as image:', error);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
        <div className='inner-modal'>
            <div className="modal-content" ref={modalRef}>
           { action === "return"?<div className="return-checkmark"></div>: <div className="purchase-checkmark"></div>}
                <div style={{alignContent: "center", textAlign: "center"}}>Successful {action}</div>
                <div style={{alignContent: "center", textAlign: "center"}}>
                  <div style={{alignContent: "center", textAlign: "center"}}>
                    <img width={"50%"} src="/invoice_img.png" alt="" />
                  </div>
                You {action}ed successfully <br />
                 <h2>{amount.toString()} DEDA </h2> 
                Transaction ID: <br /> <br />
                <div style={{fontSize:"8px", backgroundColor:"black", borderRadius:"5px", padding: "4px"}}> {tnxId} </div><br />
                </div>
            </div>
            <div className="button-container">
                <button className='savable-btn' onClick={onClose}>Close</button>
                <button className='savable-btn' onClick={saveAsImage}>Save</button>
            </div>
        </div>
    </div>
  );
};

export default InvoiceModal;

