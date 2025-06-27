import Carrusel from "../components/Carrusel";
import BooksSection from "../components/BooksSection";
import PromoBanner from "../components/PromoBanner";

function Home() {
  return (
    <>
      <Carrusel />

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

      <BooksSection
        title="EXPLORA LA RIQUEZA DE LA NARRATIVA PERUANA"
        limit={6}
      />

      <BooksSection
        title="HISTORIAS PARA SOÑAR, CRECER Y SENTIR"
        limit={6}
        ads={["/src/assets/Img/anuncio2.webp", "/src/assets/Img/anuncio3.webp"]}
      />

      <PromoBanner
        icon="bi-book-half"
        strongText="¡SOLICITA HOY, LÉELO HOY!"
        regularText=" Préstamos inmediatos en libros disponibles."
        linkText="VER MÁS"
        href="/books"
      />

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
