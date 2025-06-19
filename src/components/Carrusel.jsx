import Carousel from "react-bootstrap/Carousel";
import "../styles/Carrusel.css";

function Carrusel() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100 carrusel-img"
          src="/src/assets/Img/Carrusel-1.jpg"
          alt="Primera imagen"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carrusel-img"
          src="/src/assets/Img/Carrusel-2.jpg"
          alt="Segunda imagen"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 carrusel-img"
          src="/src/assets/Img/Carrusel-3.jpg"
          alt="Tercera imagen"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Carrusel;
