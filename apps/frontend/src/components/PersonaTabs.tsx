import { Persona } from '../types';

interface PersonaTabsProps {
  readonly selected: Persona;
  readonly onSelect: (persona: Persona) => void;
}

const PersonaTabs = ({ selected, onSelect }: PersonaTabsProps): JSX.Element => {
  return (
    <div className="tab-container">
      <button
        type="button"
        className={`tab ${selected === 'hr' ? 'active' : ''}`}
        onClick={(): void => onSelect('hr')}
      >
        人事向けビュー
      </button>
      <button
        type="button"
        className={`tab ${selected === 'employee' ? 'active' : ''}`}
        onClick={(): void => onSelect('employee')}
      >
        従業員向けビュー
      </button>
    </div>
  );
};

export default PersonaTabs;
