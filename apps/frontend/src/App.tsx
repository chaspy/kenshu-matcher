import { useState } from 'react';
import { Persona } from './types';
import PersonaTabs from './components/PersonaTabs';
import HrDashboard from './components/HrDashboard';
import EmployeePlanner from './components/EmployeePlanner';

const App = (): JSX.Element => {
  const [persona, setPersona] = useState<Persona>('hr');

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>商社向け研修マッチング</h1>
        <p className="subtitle">従業員のキャリアに合わせた研修プランを AI が提案します</p>
      </header>
      <PersonaTabs selected={persona} onSelect={setPersona} />
      <main className="app-main">
        {persona === 'hr' ? <HrDashboard /> : <EmployeePlanner />}
      </main>
    </div>
  );
};

export default App;
