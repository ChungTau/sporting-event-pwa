import { Box } from "@chakra-ui/react";
import routevideo from "../../../../assets/videos/routevideo.mp4";

function RouteVideo() {
  return (
    <Box>
      <video width="100%" height="100%" muted autoPlay loop>
        <source src={routevideo} />
      </video>
    </Box>
  );
}

export default RouteVideo;
