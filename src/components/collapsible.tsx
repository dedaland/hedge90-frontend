import { useState, ReactNode } from "react";
import "./../index.css";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
}

const Collapsible = ({ title, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapsible">
      <button className="collapsible-header" onClick={handleClick}>
        <span>{title}</span>
        <div className="arrow">{isOpen ? <img className="arrow" src="/arrow-26.svg" alt="" /> : <img className="arrow" src="/arrow-25.svg" alt="" />}</div>
      </button>
      <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default Collapsible;
