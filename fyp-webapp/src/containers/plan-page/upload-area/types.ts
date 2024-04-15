import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

export interface UploadAreaProps {
    getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
    fileSelected: boolean;
    isDragActive: boolean;
}