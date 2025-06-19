import "../styles/PromoBanner.css";

const PromoBanner = ({
  icon = "bi-person-circle",
  strongText = "¿AÚN NO TIENES CUENTA?",
  regularText = " Regístrate en Library Lectum y aprovecha todos los beneficios.",
  linkText = "CLICK AQUÍ",
  href = "/register",
}) => {
  return (
    <div className="registro-banner mt-4 full-width">
      <div className="banner-content">
        <i className={`bi ${icon} user-icon`}></i>
        <span className="banner-text">
          <strong>{strongText}</strong>
          {regularText}
        </span>
        <a href={href} className="banner-link">
          {linkText}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PromoBanner;
