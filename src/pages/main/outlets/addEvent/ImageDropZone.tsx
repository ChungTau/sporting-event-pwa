import React, {useCallback, useImperativeHandle, useState} from 'react';
import {Accept, useDropzone} from 'react-dropzone';
import {
    Flex,
    Image,
    Text,
    Spinner,
    IconButton,
    Box
} from '@chakra-ui/react';
import {RiRefreshLine, RiUploadCloud2Fill} from "react-icons/ri";
import Column from '../../../../components/Column';

export interface ImageDropZoneRef {
    getUploadedImage: () => string;
  }

interface ImageDropZoneProps {
    onImageUpload?: (imageSrc : string) => void;
    acceptedFileTypes?: Accept;
    maxSizeInBytes?: number;
}

const ImageDropZone = React.forwardRef<ImageDropZoneRef, ImageDropZoneProps>(({
    onImageUpload,  acceptedFileTypes = {
        'image/jpeg': [],
        'image/png': []
    }, maxSizeInBytes = 5000000
  }, ref) => {
    const [uploadedImage, setUploadedImage] = useState < string > ('');
    const [isLoading,
        setIsLoading] = useState < boolean > (false);
    const [errorMessage,
        setErrorMessage] = useState < string > ('');

    useImperativeHandle(ref, () => ({
        getUploadedImage: () => uploadedImage,
        }));

    const resetImage = (e : React.MouseEvent < HTMLElement >) => {
        e.preventDefault();
        setUploadedImage('');
        setErrorMessage('');
    };

    const onDrop = useCallback((acceptedFiles : File[]) => {
        const file = acceptedFiles[0];

        setIsLoading(true);
        setErrorMessage('');

        if (!file) {
            setErrorMessage('No file selected.');
            setIsLoading(false);
            return;
        }

        const reader = new FileReader();

        reader.onloadstart = () => {
            setIsLoading(true);
        };

        reader.onloadend = () => {
            setIsLoading(false);
        };

        reader.onload = (e) => {
            const result = e.target
                ?.result as string;
            setUploadedImage(result);
            onImageUpload
                ?.(result);
        };

        reader.onerror = () => {
            setErrorMessage('Error reading file.');
            setIsLoading(false);
        };

        reader.readAsDataURL(file);
    }, [onImageUpload]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop, 
        accept: acceptedFileTypes as Accept,
        maxSize: maxSizeInBytes
      });

    return (
        <Box position="relative" w="100%">
        <Flex
            justifyContent="center"
            w={'100%'}
            alignItems="center"
            flex={1}
            borderRadius={12}
            h="350px"
            minHeight="350px"
            overflow="clip"
            bgColor={uploadedImage
            ? 'transparent'
            : "#cdcdcd"}
            cursor="pointer"
            {...getRootProps()}>
            <input {...getInputProps()} aria-label="File upload"/> {isLoading
                ? (<Spinner size="xl"/>)
                : uploadedImage
                    ? (<Image
                        height="350px"
                        fit="cover"
                        borderRadius={12}
                        src={uploadedImage}
                        alt="Uploaded"/>)
                    : errorMessage
                        ? (
                            <Text color="red.500">{errorMessage}</Text>
                        )
                        : (
                            <Column align={'center'} justifyContent={'center'}>
                                <RiUploadCloud2Fill size={'40px'}/>
                                <Text mx={3}>{isDragActive
                                        ? 'Drop the file here ...'
                                        : 'Drag & drop an image here, or select a file'}</Text>
                            </Column>
                        )}
            
        </Flex>
        {uploadedImage&&<IconButton
                pos={'absolute'}
                right={0}
                bottom={0}
                aria-label="Reset image"
                icon={< RiRefreshLine />}
                onClick={resetImage}/>}
        </Box>
    );
});

export default ImageDropZone;
