import {UploadCloudIcon} from "lucide-react";
import {UploadAreaProps} from "./types";
import {Button} from "@/components/ui/button";

const UploadArea : React.FC < UploadAreaProps > = ({getRootProps, getInputProps, isDragActive, fileSelected}) => {
  const dropzone = (
    <div
            className="w-full h-full top-0 left-0 absolute flex justify-center items-center cursor-pointer bg-gray-300 dark:bg-neutral-700 rounded-md z-[102]"
            {...getRootProps()}>
            <input {...getInputProps()}/>
            <div className="items-center justify-center">
                <UploadCloudIcon className="size-10"/>
            </div>
        </div>
);

    const iconButton = (
        <Button
            {...getRootProps()}
            variant={'ghost'}
            size={'icon'}
            className="absolute top-0 right-0 m-4 z-[102] dark:bg-zinc-800/90 bg-gray-200/90 backdrop-blur-md">
            <UploadCloudIcon/>
        </Button>
    );
    return fileSelected ? iconButton : dropzone;
};

export default UploadArea