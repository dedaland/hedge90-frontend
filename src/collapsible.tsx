import { useState, ReactNode } from "react";
import "./index.css";

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
          {title}
        </button>
        <div className={`collapsible-content ${isOpen ? "open" : ""}`}>
          {children}
        </div>
      </div>
    );
  };

  export default Collapsible;