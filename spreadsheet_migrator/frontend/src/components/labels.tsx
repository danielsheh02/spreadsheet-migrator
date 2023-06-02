import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { IconButton, Typography } from "@mui/material";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const labelsList = [
  '123',
  'case_1',
  'case_2',
  'unknown',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

interface LabelsProps {
  columnLabels: { value: string, number: number }[]
  setColumnLabels: React.Dispatch<React.SetStateAction<{ value: string, number: number }[]>>
  setFocusOnElement: React.Dispatch<React.SetStateAction<string>>
}

export default function Labels({ columnLabels, setColumnLabels, setFocusOnElement }: LabelsProps) {
  const [personName, setPersonName] = React.useState<string[]>([])
  const [isFocued, setIsFocused] = React.useState(false)

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleAddClick = () => {
    setFocusOnElement("columnLabels")
    setIsFocused(true)
  }

  const handleCancelClick = () => {
    setFocusOnElement("")
    setIsFocused(false)
  }

  const handleDelete = (num: number) => {
    const filtered = columnLabels.filter((col) => col.number !== num)
    setColumnLabels(filtered)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", boxSizing: "border-box", paddingRight: 20 }}>
      <Typography fontWeight={600} fontSize={18} sx={{marginLeft: "10px"}}>
        Лейблы
      </Typography>
      <FormControl sx={{ m: 1, width: "100%" }} style={{ flexDirection: "row" }}>
        <InputLabel id="demo-multiple-chip-label">Список</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={columnLabels}
          disabled
          style={{ width: "100%" }}
          input={<OutlinedInput id="select-multiple-chip" label="Лейблы" />}
          IconComponent={undefined}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value.number} label={value.value} onDelete={() => handleDelete(value.number)} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        />
        <IconButton onClick={!isFocued ? handleAddClick : handleCancelClick}>
          {!isFocued ? (
            <AddCircleRoundedIcon fontSize={"small"} />
          ) : (
            <CancelRoundedIcon fontSize={"small"} />
          )}
        </IconButton>
      </FormControl>
    </div>
  );
}