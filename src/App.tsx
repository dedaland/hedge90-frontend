import { Routes, Route, useSearchParams } from 'react-router-dom';

import MainComponent from "./components/MainComponent";
import ChoiceComponent from './components/ChoiceComponent';

const App = () => {
const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
    <Routes>
      <Route path="/" element={<ChoiceComponent />} />
      <Route path="/referral" element={<MainComponent />} />
      <Route path="/hedge90" element={<MainComponent />} />
    </Routes>
    </>
  )
};

export default App;

