import Carrusel from "../components/Carrusel";
import BooksSection from "../components/BookSection";
import PromoBanner from "../components/PromoBanner";

function Home() {
  return (
    <>
      <Carrusel />

      {/* Sección 1 - Literatura */}
      <BooksSection
        title="NOVEDADES LITERARIAS QUE NO TE PUEDES PERDER"
        ads={["/src/assets/Img/anuncio1.jpg"]}
      />
      <PromoBanner
        icon="bi-person-circle"
        strongText="¿AÚN NO TIENES CUENTA?"
        regularText=" Regístrate en Library Lectum y aprovecha todos los beneficios."
        linkText="CLICK AQUÍ"
        href="/register"
      />

      {/* Sección 2 - Narrativa Peruana */}
      <BooksSection
        title="EXPLORA LA RIQUEZA DE LA NARRATIVA PERUANA"
        ads={["/src/assets/Img/anuncio2.webp", "/src/assets/Img/anuncio3.webp"]}
      />
      <PromoBanner
        icon="bi-book-half"
        strongText="¡SOLICITA HOY, LÉELO HOY!"
        regularText=" Préstamos inmediatos en libros disponibles."
        linkText="VER MÁS"
        href="/books"
      />

      {/* Sección 3 - Cómics */}
      <BooksSection
        title="COMICS, MANGAS Y MUCHA EMOCIÓN EN CADA PÁGINA"
        limit={6}
        ads={[
          "/src/assets/Img/mini1.webp",
          "/src/assets/Img/mini2.webp",
          "/src/assets/Img/mini3.webp",
        ]}
      />
    </>
  );
}

export default Home;
