// UploadButton.tsx
import React from "react";
import { IconButton, Box, Text } from "@chakra-ui/react";
import { RiUploadCloud2Fill } from "react-icons/ri";
import Column from "../../../../components/Column";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

interface UploadAreaProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  fileSelected: boolean;
  isDragActive: boolean;
}
const UploadArea: React.FC<UploadAreaProps> = ({ getRootProps, getInputProps, isDragActive, fileSelected }) => {
    const uploadButton = (
      <IconButton
        {...getRootProps()}
        m={2}
        aria-label={"upload-file"}
        icon={<RiUploadCloud2Fill />}
        pos={"absolute"}
        top={0}
        right={0}
        backgroundColor={"rgba(0,0,0,0.6)"}
        color={"white"}
        backdropFilter={"blur(4px)"}
        _hover={{ bgColor: "rgba(0,0,0,0.5)" }}
      />
    );
  
    const dropzoneContent = (
      <Box
        pos={"absolute"}
        right={0}
        top={0}
        width={"100%"}
        height={"430px"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        backgroundColor={"rgba(0,0,0,0.5)"}
        backdropFilter={"blur(4px)"}
        color={"white"}
        borderTopRadius={12}
        zIndex={10}
        opacity={fileSelected ? 0 : 1}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Column align={"center"} justifyContent={"center"}>
          <RiUploadCloud2Fill size={"40px"} />
          <Text mx={3}>
            {isDragActive
              ? "Drop the file here ..."
              : "Drag & drop an image here, or select a file"}
          </Text>
        </Column>
      </Box>
    );
  
    return fileSelected ? uploadButton : dropzoneContent;
  };
  
export default UploadArea;
