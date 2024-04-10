
interface FadeInScaleProps {
    children : React.ReactNode;
    duration?: number; // Duration in seconds
    initialScale?: number; // Starting scale, less than 1 to start zoomed out
}