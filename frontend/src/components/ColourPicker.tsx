import { HexColorPicker } from 'react-colorful'

type ColourPickerProps = {
  value: string
  onChange: (color: string) => void
}

function ColourPicker({ value, onChange }: ColourPickerProps) {
  return <HexColorPicker color={value} onChange={onChange} />
}

export default ColourPicker
