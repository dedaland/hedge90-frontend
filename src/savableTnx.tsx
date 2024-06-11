
import React, { useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import './index.css';

const InvoiceModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const saveAsImage = () => {
    if (modalRef.current) {
      htmlToImage.toPng(modalRef.current, {
        width:350, height:350,
        canvasWidth:350, canvasHeight:350,
    })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'modal-image.png';
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
        <div style={{width:"360px", margin:"100px auto", alignContent:"center"}}>
            <div className="modal-content" ref={modalRef}>
                <h2>Purchase Invoice</h2>
                <p>
                You purcahsed 1000000 DedaCoin successfully! <br /> <br />
                Transaction ID: <br />
                <span style={{fontSize:"8px"}}> 0x1e0d8fd0ecc7d1e8515777c28c07fefb024197ca73362ab46489b57a898d5781 </span><br />
                </p>
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

