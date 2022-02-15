import React, {Fragment} from "react";
import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, Slider, SliderFilledTrack, SliderThumb, SliderTrack
} from "@chakra-ui/react";

interface INumberInputSliderProps {
  value: number;
  setValue: (v: number) => void;
}

const NumberInputSlider = (props: INumberInputSliderProps) => {
  const {value, setValue} = props;

  const onInputChange = async (asString: string, asNumber: number) => setValue(asNumber);
  const onSliderChange = async (number: number) => setValue(number);

  return (
    <Fragment>
      <NumberInput value={value} step={1} onChange={onInputChange} >
        <NumberInputField disabled={true} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider
        flex='1'
        focusThumbOnChange={false}
        value={value}
        onChange={onSliderChange}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize='sm' boxSize='32px' children={value} />
      </Slider>
    </Fragment>

  );
}

export default NumberInputSlider;
