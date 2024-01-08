
type PresetIconButtonProps = {
    isSelected: boolean;
    label: string;
    IconComponent: React.ElementType; // This allows any React component to be passed.
    onPresetSelect: (preset : string) => void; // Function that takes the preset string.
};

// PresetIconButton component with typed props
const PresetIconButton : React.FC < PresetIconButtonProps > = ({isSelected, label, IconComponent, onPresetSelect}) => (



        <div
    role="button"
    aria-label={label}
    onClick={() => onPresetSelect(label)}
    style={{
      borderRadius: '24px',
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      backgroundColor: isSelected ? 'tomato' : 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
      // Add other styles as needed
    }}
  >
    <IconComponent />
  </div>
);

export default PresetIconButton;