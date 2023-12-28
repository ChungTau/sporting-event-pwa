import React, { useState, useEffect, forwardRef } from 'react';
import { Textarea, Text, TextareaProps, Flex } from '@chakra-ui/react';

interface TextAreaProps extends TextareaProps {
  maxLength?: number;
  onTextChange?: (text: string) => void;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ maxLength = 500, value, onTextChange, ...props }, ref) => {
    const [text, setText] = useState<string>(value as string || '');

    useEffect(() => {
      setText(value as string || '');
    }, [value]);

    const handleTextChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      const newText = e.target.value;
      setText(newText);
      if (onTextChange) {
        onTextChange(newText);
      }
    };

    return (
      <Flex flexDirection="column" alignItems="end">
        <Textarea
          ref={ref}
          value={text}
          onChange={handleTextChange}
          maxLength={maxLength}
          {...props}
        />
        <Text mt={1} fontSize="sm" color="gray.200">
          {`${text.length} / ${maxLength}`}
        </Text>
      </Flex>
    );
  }
);

export default TextArea;
