import React, {Fragment, KeyboardEvent, MouseEventHandler, useEffect, useState} from "react";
import {
  Box, Center,
  Flex, Input, InputGroup,
  NumberInput,
  NumberInputField, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack,
  Spacer,
  Text
} from "@chakra-ui/react";

interface INumberInputRangeProps {
  min: number;
  max: number;
  currentRange: number[];
  setCurrentRange: (v: number[]) => void;
  unitOfMeasure?: string;
  step?: number;
}

const NumberInputRange = (props: INumberInputRangeProps) => {
  const {min, max, currentRange, setCurrentRange, unitOfMeasure, step} = props;
  const unit = unitOfMeasure ?? ""
  const [minInnerStr, setMinInnerStr] = useState<string>(`${currentRange[0]} ${unit}`);
  const [maxInnerStr, setMaxInnerStr] = useState<string>(`${currentRange[1]} ${unit}`);
  const [minInner, setMinInner] = useState<number>(currentRange[0]);
  const [maxInner, setMaxInner] = useState<number>(currentRange[1]);

  useEffect(() => {
    setMinInnerStr(`${currentRange[0]} ${unit}`);
    setMinInner(currentRange[0]);
    setMaxInnerStr(`${currentRange[1]} ${unit}`);
    setMaxInner(currentRange[1]);
  }, [currentRange]);

  const onInputChange = (callback: (v: string) => void) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const str = event.target.value;
    callback(str);
  }

  const onKeyPressed = (
    setRange: (v: number[]) => void,
    setInner: (v: string) => void,
    str: string,
    current: number[],
    def: number,
    isMin: boolean
  ) => async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const numStr = str.replace(` ${unit}`,'');
      const num = parseInt(numStr, 10);
      if (numStr.length > 0 && !isNaN(num)) {
        if (num < min) {
          setRange([min, current[1]]);
          setInner(`${min} ${unit}`);
        } else if (max < num) {
          setRange([current[0], max]);
          setInner(`${max} ${unit}`);
        } else {
          if (num !== current[0] || num !== current[1]) {
            isMin ? setRange([num, current[1]]) : setRange([current[0], num]);
          } else {
            isMin ? setInner(`${current[0]} ${unit}`) : setInner(`${current[1]} ${unit}`);
          }
        }
      } else {
        isMin ? setRange([def, current[1]]) : setRange([current[0], def]);
        setInner(`${def} ${unit}`);
      }
    }
  };

  const onSliderChangeEnd = async (range: number[]) => {
    setCurrentRange(range);
  }

  const onSliderChange = async (range: number[]) => {
    setMinInner(range[0]);
    setMaxInner(range[1]);
    setMinInnerStr(`${range[0]} ${unit}`);
    setMaxInnerStr(`${range[1]} ${unit}`);
  }

  return (
    <Flex width="100%" h="100px" direction="column">
      <Flex h="50%" mx="3">
        <RangeSlider
          value={[minInner, maxInner]}
          min={min}
          max={max}
          step={step ?? 1}
          onChange={onSliderChange}
          onChangeEnd={onSliderChangeEnd}
        >
          <RangeSliderTrack >
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb boxSize={5} index={0} bg="grey" />
          <RangeSliderThumb boxSize={5} index={1} bg="grey" />
        </RangeSlider>

      </Flex>

      <Flex h="50%" w="100%">
        <Flex w="100%">
          <Flex width="100px" alignContent="center">
            <InputGroup>
              <Input
                value={minInnerStr}
                borderRadius="full" backgroundColor="#fafafa" borderWidth="1" borderColor="grey"
                onChange={onInputChange(setMinInnerStr)}
                onKeyDown={onKeyPressed(setCurrentRange, setMinInnerStr, minInnerStr, currentRange, min, true)}
                type="text"
                style={{textAlign: "center"}}
              />
            </InputGroup>
          </Flex>
          <Spacer />
          <Flex width="5%" alignContent="center" alignItems="center">
            <Text color="grey" w="100%" fontSize="50" pb="5">
              -
            </Text>
          </Flex>
          <Spacer />
          <Flex width="100px" alignContent="center">
            <InputGroup>
              <Input
                value={maxInnerStr}
                borderRadius="full" backgroundColor="#fafafa" borderWidth="1" borderColor="grey"
                onChange={onInputChange(setMaxInnerStr)}
                onKeyDown={onKeyPressed(setCurrentRange, setMaxInnerStr, maxInnerStr, currentRange, max, false)}
                type="text"
                style={{textAlign: "center"}}
              />
            </InputGroup>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default NumberInputRange;
