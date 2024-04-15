import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SubmissionStatus } from "@/types/submissionStatus";
import { Loader2 } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

interface ResponseDialogProps {
    open: boolean;
    onClose?: (open: boolean) => void;
    status: SubmissionStatus; // Ensuring 'status' is passed and used correctly
    redirectPath: string;
    name: string;
}

function ResponseDialog({ open, onClose, status, name, redirectPath }: ResponseDialogProps) {
    const router = useRouter();
    const pathName = usePathname();
    const [basePath, subRoute] = pathName.split("/").slice(1);
    const getDialogContent = () => {
        switch (status) {
            case SubmissionStatus.Loading:
                return (
                    <AlertDialogHeader>
                        <AlertDialogTitle>Uploading...</AlertDialogTitle>
                        <AlertDialogDescription className="justify-center items-center">
                            <Loader2 className="h-10 w-10 animate-spin" />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                );
            case SubmissionStatus.Error:
                return (
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div>{`There was an error uploading your ${name.toLocaleLowerCase()}. Please try again.`}</div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                );
            case SubmissionStatus.Finished:
                return (
                    <Fragment>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Uploaded Successfully</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div>{`Your ${name.toLocaleLowerCase()} has been uploaded successfully.`}</div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogAction onClick={()=>{
                            router.replace(pathName);
                        }}>{`Create new ${name}`}</AlertDialogAction>
                        <AlertDialogAction onClick={()=>{
                            router.push(`/${basePath}/${redirectPath}`);
                        }} className="bg-green-600">{`View "My ${name}"`}</AlertDialogAction>
                    </AlertDialogFooter>
                  </Fragment>
                );
            default:
                return null;
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                {getDialogContent()}
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ResponseDialog;
