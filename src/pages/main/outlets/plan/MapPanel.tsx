import { IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useBreakpointValue } from "@chakra-ui/react";
import { IoIosMore } from "react-icons/io";
import { IoPlay, IoStop, IoMenu } from "react-icons/io5";
import Row from "../../../../components/Row";
import DraggablePinButton from "./DraggablePinButton";

const MapPanel = () => {
  const isMobile = useBreakpointValue({base: true, md: false});

  const iconButtonStyles = {
    w: "24px",
    _active: { bgColor: "rgba(0,0,0,0.4)", color: "#db7987" },
    _hover: { bgColor: "rgba(0,0,0,0.4)" },
    bgColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    color: "white",
  };

  return (
    <Row pos="absolute" top={2} left={2}>
      <Menu closeOnSelect={false}>
        <MenuButton as={IconButton} {...iconButtonStyles} aria-label="togglePanel" icon={<IoMenu />} />
        <MenuList minW="150px" borderColor="transparent" bgColor="rgba(0,0,0,0.4)" backdropFilter="blur(4px)">
          {isMobile && (
            <>
              <MenuItem
                _active={{ bgColor: "rgba(0,0,0,0.2)", color: "#db7987" }}
                _hover={{ bgColor: "rgba(0,0,0,0.2)" }}
                color="white"
                bgColor="transparent"
                icon={<IoPlay />}
                onClick={() => console.log("Play clicked")}
              >
                Play
              </MenuItem>
              <MenuItem
                _active={{ bgColor: "rgba(0,0,0,0.2)", color: "#db7987" }}
                _hover={{ bgColor: "rgba(0,0,0,0.2)" }}
                color="white"
                bgColor="transparent"
                icon={<IoStop />}
                onClick={() => console.log("Stop clicked")}
              >
                Stop
              </MenuItem>
              <MenuDivider mx={2} aria-orientation="horizontal" height={1} borderColor="whiteAlpha.500" />
            </>
          )}
          <MenuItem
            _active={{ bgColor: "rgba(0,0,0,0.2)", color: "#db7987" }}
            _hover={{ bgColor: "rgba(0,0,0,0.2)" }}
            color="white"
            bgColor="transparent"
            icon={<IoIosMore />}
            onClick={() => console.log("More clicked")}
          >
            More
          </MenuItem>
        </MenuList>
      </Menu>
      <DraggablePinButton/>
      {!isMobile && (
        <>
          <IconButton aria-label="play" {...iconButtonStyles} icon={<IoPlay />} />
          <IconButton aria-label="stop" {...iconButtonStyles} icon={<IoStop />} />
        </>
      )}
    </Row>
  );
};

export default MapPanel;