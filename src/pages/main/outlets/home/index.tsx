import Center from "../../../../components/Center";
import RouteVideo from "./RouteVideo";
import ListEvents from "./ListEvents";
import SearchAndFilterEvent from "./SearchAndFilterEvent";
import HomeFooter2 from "./HomeFooter2";
import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import EventData from "../../../../models/EventData";

const eventCards = [
  {
    name: "name3",
    type: "race",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-06-01"),
    endDateTime: new Date("2023-06-03"),
    backgroundImage: new Blob(),
    description: "description",
    remark: "remark",
    venue: {
      lng: 89.5,
      lat: 44.5,
      address: "address",
      name: "name",
    },
  },
  {
    name: "name5",
    type: "companion",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-04-01"),
    endDateTime: new Date("2023-04-03"),
    backgroundImage: new Blob(),
    description: "",
    remark: "",
    venue: {
      lng: 189.5,
      lat: 24.5,
      address: "address",
      name: "name",
    },
  },
  {
    name: "name1",
    type: "challenge",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-02-15"),
    endDateTime: new Date("2023-02-16"),
    backgroundImage: new Blob(),
    description: "",
    remark: "",
    venue: {
      lng: 22.5,
      lat: 84.5,
      address: "address",
      name: "name",
    },
  },
  {
    name: "name6",
    type: "companion",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-03-18"),
    endDateTime: new Date("2023-03-19"),
    backgroundImage: new Blob(),
    description: "",
    remark: "",
    venue: {
      lng: 15.5,
      lat: 153.5,
      address: "address",
      name: "name",
    },
  },
  {
    name: "name2",
    type: "race",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-02-09"),
    endDateTime: new Date("2023-02-14"),
    backgroundImage: new Blob(),
    description: "",
    remark: "",
    venue: {
      lng: 23.5,
      lat: 69.5,
      address: "address",
      name: "name",
    },
  },
  {
    name: "name4",
    type: "challenge",
    privacy: "privacy",
    maxOfParti: 10,
    startDateTime: new Date("2023-06-03"),
    endDateTime: new Date("2023-06-06"),
    backgroundImage: new Blob(),
    description: "",
    remark: "",
    venue: {
      lng: 125.5,
      lat: 12.5,
      address: "address",
      name: "name",
    },
  },
];

function HomePage() {
  const [filteredEventCards, setFilteredEventCards] =
    useState<EventData[]>(eventCards);
  const [value, setValue] = useState("");
  const [locationPosition, setLocationPosition] = useState({
    defaultLatitude: 0,
    defaultLongitude: 0,
  });

  function handleSearch(event: any) {
    setValue(event.target.value);
    const Cards = eventCards.filter((cards) =>
      cards.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredEventCards([...Cards]);
  }

  function HandleSort(sortBy: string) {
    console.log(sortBy);

    if (sortBy === "date") {
      const Cards = eventCards.sort(
        (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
      );
      setFilteredEventCards([...Cards]);
      console.log("date" + JSON.stringify(Cards));
    } else if (sortBy === "title") {
      const Cards = eventCards.sort((a, b) => (a.name > b.name ? 1 : -1));
      setFilteredEventCards([...Cards]);
    }
  }

  console.log(".........." + JSON.stringify(filteredEventCards));

  const handleShowNearestEvent = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocationPosition({
        ...position,
        defaultLatitude: position.coords.latitude,
        defaultLongitude: position.coords.longitude,
      });
    });

    const Card = getFinalTrial();
    const Cards = eventCards.filter((cards) =>
      cards.name.toLowerCase().includes(Card.toLowerCase())
    );

    setFilteredEventCards([...Cards]);
  };

  function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const distance = lon1 - lon2;
    const radDistance = (Math.PI * distance) / 180;

    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radDistance);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;

    return dist;
  }

  const getFinalTrial = () => {
    if (eventCards) {
      const trailLatitude = eventCards.map((card) => card.venue.lat);
      const trailLongitude = eventCards.map((card) => card.venue.lng);

      const distanceArray = trailLatitude.map((lat, idx) => {
        const lng = trailLongitude[idx];

        return distance(
          locationPosition.defaultLatitude,
          locationPosition.defaultLongitude,
          lat,
          lng
        );
      });
      const closest = Math.min(...distanceArray);
      console.log(closest);
      const cloestLocation = distanceArray.indexOf(closest);

      return eventCards[cloestLocation].name;
    }
    return "";
  };
  function handleChangeEventType(event: any) {
    const Cards = eventCards.filter((cards) =>
      cards.type.toLowerCase().includes(event.target.value.toLowerCase())
    );
    console.log("type" + JSON.stringify(Cards));
    setFilteredEventCards([...Cards]);
  }

  return (
    <Center>
      <Flex flexDirection="column">
        <RouteVideo />
        <SearchAndFilterEvent
          value={value}
          onSearch={handleSearch}
          onSort={HandleSort}
          onShowNearestEvent={handleShowNearestEvent}
          onChangeEventType={handleChangeEventType}
        />
        <ListEvents eventCards={filteredEventCards} />
        <HomeFooter2 />
      </Flex>
    </Center>
  );
}

export default HomePage;
