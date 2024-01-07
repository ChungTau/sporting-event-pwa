import * as React from "react";
import "../../../main/outlets/home/css/SlideShow.css";

const images = [
  process.env.PUBLIC_URL + "/trail_running_1.png",
  process.env.PUBLIC_URL + "/trail_running_2.png",
  process.env.PUBLIC_URL + "/trail_running_3.png",
];
const delay = 4000;

function SlideShow() {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(0);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
    resetTimeout();

    timeoutRef.current = window.setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {images.map((value, index) => (
          <img className="slide" key={index} src={value} alt={"" + index} />
        ))}
      </div>{" "}
      <div className="slideshowDots">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default SlideShow;
